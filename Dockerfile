ARG HASKELL_IMAGE=haskell:9.6.6-slim
FROM node:22-bookworm-slim@sha256:83f487e0a63425e5b4d146fb5e5be574bcbe1b7b843d3ebafdd95eaf7767a7e5 AS frontend
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g elm@0.19.1-6
WORKDIR /src/web
COPY web/elm.json ./
COPY web/src ./src
COPY web/public ./public
COPY tests/state.test.cjs tests/ui.test.cjs /src/tests/
RUN mkdir -p dist/css && elm make src/Main.elm --optimize --output=dist/main.js && cp public/index.html public/bootstrap.js dist/ && cp public/css/app.css dist/css/
RUN apt-get update && apt-get install -y --no-install-recommends chromium-headless-shell && rm -rf /var/lib/apt/lists/*
RUN node --test /src/tests/state.test.cjs && CHROME_PATH=/usr/lib/chromium/chromium-headless-shell node --test /src/tests/ui.test.cjs

FROM ${HASKELL_IMAGE} AS backend
# Match the SQLite headers to the security-updated library in this GHC image.
RUN rm -f /etc/apt/sources.list.d/*.list /etc/apt/sources.list.d/*.sources && \
    printf '%s\n' 'deb http://archive.debian.org/debian bullseye main' > /etc/apt/sources.list && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get -o Acquire::Retries=3 update && \
    apt-get -o Acquire::Retries=3 install -y --no-install-recommends pkg-config ca-certificates curl && \
    arch="$(dpkg --print-architecture)" && \
    curl -fSL --retry 3 "https://archive.debian.org/debian-security/pool/updates/main/s/sqlite3/libsqlite3-dev_3.34.1-3+deb11u1_${arch}.deb" -o /tmp/libsqlite3-dev.deb && \
    apt-get install -y --no-install-recommends /tmp/libsqlite3-dev.deb && \
    pkg-config --modversion sqlite3 && \
    rm -f /tmp/libsqlite3-dev.deb && rm -rf /var/lib/apt/lists/*
WORKDIR /src/api
COPY api/ecc-crm-api.cabal api/cabal.project api/cabal.project.freeze ./
RUN cabal update && cabal build --only-dependencies
COPY api/app ./app
COPY api/src ./src
COPY api/test ./test
COPY api/migrations ./migrations
RUN cabal test all && cabal build && cp "$(cabal list-bin exe:ecc-crm-api)" /usr/local/bin/ecc-crm-api

FROM debian:bookworm-slim@sha256:7c7b2c966bc9ee8cedfeef67e0e279108992c77681fa595db4a9d65c06ccc587 AS runtime
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends libsqlite3-0 libgmp10 ca-certificates curl python3 && rm -rf /var/lib/apt/lists/* && useradd --system --uid 10001 app && mkdir -p /data && chown app /data
WORKDIR /app
COPY --from=backend /usr/local/bin/ecc-crm-api /usr/local/bin/
COPY --from=frontend /src/web/dist ./web
COPY api/migrations ./migrations
COPY scripts/backup.sh scripts/restore.sh scripts/sqlite_backup.py ./scripts/
ENV APP_ENV=production PORT=4000 WEB_DIST=/app/web SEED_DEMO=false DATABASE_PATH=/data/ecc-crm.sqlite3
VOLUME ["/data"]
USER app
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD curl --fail http://127.0.0.1:4000/api/ready || exit 1
ENTRYPOINT ["ecc-crm-api"]

# Generate the manifest only after the Haskell, Elm state, browser, and HTTP/database tests pass.
FROM runtime AS verification
USER root
WORKDIR /src
COPY . .
COPY --from=frontend /src/web/dist ./web/dist
RUN ECC_API_BINARY=/usr/local/bin/ecc-crm-api ECC_RUN_HTTP_TESTS=1 python3 -m unittest discover -s tests -p 'test_*.py' -v
RUN python3 -c 'exec("import base64, hashlib, json, pathlib\nweb = pathlib.Path('\''/app/web'\'')\nmigrations = pathlib.Path('\''/app/migrations'\'')\ndef digest(path):\n    return base64.urlsafe_b64encode(hashlib.sha256(path.read_bytes()).digest()).decode().rstrip('\''='\'')\nassets = [\"index.html\",\"main.js\",\"bootstrap.js\",\"css/app.css\"]\nmanifest = {'\''contract'\'': '\''ecc-crm-20261019-v1'\'', '\''verified'\'': True, '\''backend'\'': digest(pathlib.Path('\''/usr/local/bin/ecc-crm-api'\'')), '\''assets'\'': {name: digest(web / name) for name in assets}, '\''migrations'\'': {p.name: digest(p) for p in sorted(migrations.glob('\''*.sql'\''))}}\n(web / '\''release.json'\'').write_text(json.dumps(manifest, indent=2) + '\''\\n'\'')\n")'

FROM runtime AS release
COPY --from=verification /app/web/release.json /app/web/release.json
RUN APP_ENV=development ecc-crm-api verify-release
