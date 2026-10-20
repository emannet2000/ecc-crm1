#!/usr/bin/env python3
"""Supervised backups, encrypted off-site copies, restore drills and health alerts.
No credentials or customer data are written to alerts or status files.
"""
import argparse
from contextlib import closing
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sqlite3
import shutil
import release
import subprocess
import tempfile
import time
import urllib.request
import urllib.parse
import recovery


def env_path(name, default=None):
    value = os.environ.get(name, default)
    if not value:
        raise ValueError(name + ' is required')
    return Path(value).absolute()


def run_restic(arguments, timeout=900):
    repository = os.environ.get('RESTIC_REPOSITORY', '')
    if not repository.startswith(('s3:', 'sftp:', 'rest:', 'b2:', 'azure:', 'gs:', 'rclone:')):
        raise ValueError('RESTIC_REPOSITORY must use a configured off-site backend')
    password_file = env_path('RESTIC_PASSWORD_FILE')
    if not password_file.is_file() or password_file.stat().st_mode & 0o077:
        raise ValueError('Restic password file must be private (mode 0600 or 0400)')
    # No shell interpolation and no command/credential text in errors or alerts.
    result = subprocess.run([os.environ.get('RESTIC_BIN', 'restic'), *arguments],
                            capture_output=True, timeout=timeout, check=False)
    if result.returncode:
        raise RuntimeError('Encrypted off-site operation failed')
    return result.stdout.decode('utf-8')


def offsite(snapshot, directory, runner=run_restic):
    snapshot = Path(snapshot).absolute()
    recovery.verify(snapshot)
    output = runner(['backup', '--json', '--tag', 'ecc-recovery', '--',
                     str(snapshot), str(recovery.manifest_path(snapshot))])
    summary = next((json.loads(line) for line in reversed(output.splitlines())
                    if line.strip() and json.loads(line).get('message_type') == 'summary'), None)
    ident = summary.get('snapshot_id') if summary else None
    if not ident or not all(c in '0123456789abcdef' for c in ident):
        raise ValueError('Off-site upload returned no snapshot identity')
    # Restore remote bytes, not just metadata: this tests encryption keys and access.
    with tempfile.TemporaryDirectory(prefix='ecc-offsite-drill-') as temporary:
        runner(['restore', ident, '--target', temporary])
        restored = Path(temporary) / str(snapshot).lstrip('/')
        metadata = recovery.verify(restored)
        if metadata['sha256'] != recovery.digest(snapshot):
            raise ValueError('Off-site restore differs from the local snapshot')
        if recovery.database_summary(restored) != recovery.database_summary(snapshot):
            raise ValueError('Off-site recovery data differs')
    status = {'lastSuccess': recovery.utc_now().isoformat(), 'snapshotId': ident,
              'snapshot': snapshot.name, 'sha256': metadata['sha256'],
              'restoreVerified': True}
    recovery.atomic_json(Path(directory) / 'offsite-status.json', status)
    return status


def backup(database, directory, remote=True, runner=run_restic):
    directory = Path(directory).absolute()
    # Snapshot/retention functions acquire their own locks. An outer job lock
    # protects the upload/drill sequence from overlapping systemd/manual runs.
    with recovery.manager_lock(directory / 'jobs'):
        recovery.retain(directory)
        target = recovery.backup_once(database, directory)
        recovery.drill(target)
        if remote:
            offsite(target, directory, runner)
        recovery.retain(directory)
        return {'event': 'backup-verified', 'offsite': remote, 'snapshot': target.name}


def age_seconds(value, now):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    age = (now - parsed).total_seconds()
    if age < -300:
        raise ValueError('Future health timestamp')
    return age


def readiness_problem(endpoint):
    parsed = urllib.parse.urlsplit(endpoint)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path != '/api/ready':
        return 'api:invalid-health-url'
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, request, fp, code, msg, headers, newurl):
            return None
    try:
        with urllib.request.build_opener(NoRedirect).open(endpoint, timeout=10) as response:
            body = response.read(4097)
            if response.status != 200 or len(body)>4096:
                return 'api:unavailable'
            value = json.loads(body)
            if value.get('status') != 'ready' or value.get('contract') != release.contract():
                return 'api:incompatible-or-not-ready'
    except (OSError, ValueError, TypeError, AttributeError):
        return 'api:unavailable'
    return None


def storage_problem(path, name):
    try:
        candidate = Path(path).absolute()
        while not candidate.exists() and candidate != candidate.parent:
            candidate = candidate.parent
        usage = shutil.disk_usage(candidate)
        if usage.free < max(256*1024*1024, usage.total*0.05):
            return name+':low-space'
    except OSError:
        return name+':space-check-failed'
    return None


def health(database, directory, require_offsite=True, now=None):
    now = now or recovery.utc_now()
    problems = [problem for problem in [storage_problem(Path(database).parent,'database-storage'), storage_problem(directory,'backup-storage')] if problem]
    endpoint = os.environ.get('HEALTH_URL')
    if endpoint:
        problem = readiness_problem(endpoint)
        if problem: problems.append(problem)
    elif require_offsite:
        problems.append('api:health-url-not-configured')
    for filename, field, maximum in [('backup-status.json', 'lastSuccess', 7200),
                                      ('restore-drill-status.json', 'verifiedAt', 7200),
                                      *([('offsite-status.json', 'lastSuccess', 7200)] if require_offsite else [])]:
        try:
            metadata = json.loads((Path(directory) / filename).read_text())
            if age_seconds(metadata[field], now) > maximum:
                problems.append(filename + ':stale')
            if filename == 'offsite-status.json' and metadata.get('restoreVerified') is not True:
                problems.append('offsite-status.json:restore-unverified')
        except (OSError, ValueError, KeyError, TypeError):
            problems.append(filename + ':missing-or-invalid')
    try:
        job = json.loads((Path(directory) / 'backup-job-status.json').read_text())
        if job.get('state') == 'failed' or job.get('state') == 'running' and age_seconds(job['attemptedAt'], now)>2400:
            problems.append('backup-job:failed-or-interrupted')
    except (OSError, ValueError, KeyError, TypeError):
        pass
    try:
        with closing(recovery.readonly(Path(database))) as conn:
            failed_mail = conn.execute("SELECT count(*) FROM mail_outbox WHERE sent_at IS NULL AND (attempts>=5 OR created_at<datetime('now','-30 minutes'))").fetchone()[0]
            if failed_mail:
                problems.append('email:failed-or-stuck')
            for table in ('documents', 'financial_files'):
                failed = conn.execute("SELECT count(*) FROM " + table + " WHERE scan_status='Error' OR scan_status IN ('Pending','Scanning') AND created_at<datetime('now','-30 minutes')").fetchone()[0]
                if failed:
                    problems.append(table + ':scanning-failed-or-stuck')
    except (OSError, sqlite3.Error):
        problems.append('database:health-query-failed')
    return sorted(set(problems))


def send_alert(payload):
    endpoint = os.environ.get('ALERT_WEBHOOK_URL', '')
    parsed = urllib.parse.urlsplit(endpoint)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Configure an HTTPS alert webhook')
    headers = {'Content-Type': 'application/json'}
    token_file = os.environ.get('ALERT_TOKEN_FILE')
    if token_file:
        token = Path(token_file).read_text().strip()
        if not token or '\n' in token or '\r' in token:
            raise ValueError('Invalid alert token')
        headers['Authorization'] = 'Bearer ' + token
    # Redirects could send authorization to another host. Reject them.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, hdrs, newurl):
            return None
    request = urllib.request.Request(endpoint, data=json.dumps(payload).encode(), headers=headers, method='POST')
    with urllib.request.build_opener(NoRedirect).open(request, timeout=15) as response:
        if not 200 <= response.status < 300:
            raise RuntimeError('Alert delivery failed')


def monitor(database, directory, remote=True, sender=send_alert, extra=()):
    directory = Path(directory)
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    with recovery.manager_lock(directory / 'monitor'):
        problems = sorted(set(health(database, directory, remote) + list(extra)))
        path = directory / 'operations-status.json'
        try:
            old = json.loads(path.read_text())
        except (OSError, ValueError):
            old = {}
        now = recovery.utc_now()
        changed = old.get('problems') != problems
        due = not old.get('alertDelivered') or age_seconds(old.get('alertedAt', '1970-01-01T00:00:00+00:00'), now) >= 3600
        needs_alert = bool(problems) and (changed or due) or not problems and bool(old.get('problems')) or old.get('notificationPending', False)
        delivered = old.get('alertDelivered', False)
        alerted = old.get('alertedAt')
        if needs_alert:
            try:
                sender({'service': 'ecc-crm', 'event': 'operations-failure' if problems else 'operations-recovered',
                        'problems': problems, 'checkedAt': now.isoformat()})
                delivered, alerted = True, now.isoformat()
            except Exception:
                delivered = False
        status = {'checkedAt': now.isoformat(), 'problems': problems,
                  'healthy': not problems, 'alertDelivered': delivered, 'alertedAt': alerted,
                  'notificationPending': bool(needs_alert and not delivered)}
        recovery.atomic_json(path, status)
        return status


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['backup', 'monitor', 'check', 'alert-test'])
    parser.add_argument('--database', default=os.environ.get('DATABASE_PATH'), required=not os.environ.get('DATABASE_PATH'))
    parser.add_argument('--directory', default=os.environ.get('BACKUP_DIR', '/var/backups/ecc'))
    parser.add_argument('--local-only', action='store_true', help='Explicit local test mode; production requires off-site backup')
    args = parser.parse_args()
    if args.command == 'alert-test':
        send_alert({'service':'ecc-crm','event':'operations-test','checkedAt':recovery.utc_now().isoformat()})
        print(json.dumps({'event':'alert-test-delivered'}))
        return
    if args.command == 'backup':
        directory = Path(args.directory)
        directory.mkdir(mode=0o700, parents=True, exist_ok=True)
        attempted = recovery.utc_now().isoformat()
        recovery.atomic_json(directory / 'backup-job-status.json', {'state':'running','attemptedAt':attempted})
        try:
            result = backup(args.database, args.directory, not args.local_only)
        except Exception as exc:
            recovery.atomic_json(directory / 'backup-job-status.json', {'state':'failed','attemptedAt':attempted,'error':type(exc).__name__})
            status = monitor(args.database, args.directory, not args.local_only,
                             extra=['backup-job:' + type(exc).__name__])
            print(json.dumps({'event': 'backup-failed', **status}), flush=True)
            raise SystemExit(1)
        recovery.atomic_json(directory / 'backup-job-status.json', {'state':'succeeded','attemptedAt':attempted})
        print(json.dumps(result), flush=True)
    elif args.command == 'monitor':
        result = monitor(args.database, args.directory, not args.local_only)
        print(json.dumps(result), flush=True)
        raise SystemExit(0 if result['healthy'] and not result['notificationPending'] else 1)
    else:
        problems = health(args.database, args.directory, not args.local_only)
        print(json.dumps({'healthy': not problems, 'problems': problems}), flush=True)
        raise SystemExit(bool(problems))


if __name__ == '__main__':
    main()
