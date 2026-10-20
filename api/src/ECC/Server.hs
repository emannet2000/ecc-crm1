{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
module ECC.Server (operational, staticFiles, transactionalApplication, boundedBodies, withPermit) where
import Control.Exception (SomeException, catch, bracket)
import System.Timeout (timeout)
import qualified ECC.Store as Store
import qualified Data.Aeson as A
import qualified Data.ByteString.Lazy as BL
import qualified Data.ByteString as B
import qualified Data.Text as T
import qualified Data.Text.Encoding as TE
import Data.List (isSuffixOf)
import Data.IORef
import Data.Time.Clock (getCurrentTime, diffUTCTime)
import Network.HTTP.Types
import qualified Network.Wai as Wai
import Network.Wai.Internal (ResponseReceived(..))
import System.Directory (doesFileExist)
import System.IO (hFlush, stdout)
import ECC.Config
import ECC.Release (releaseContract)

transactionalApplication :: Store.Connection -> Wai.Middleware
transactionalApplication cn application req respond =
        (do
            -- A connection-local shadow holds read authorization without writing main.
            _ <- Store.execute_ cn "CREATE TEMP TABLE IF NOT EXISTS request_context (id INTEGER PRIMARY KEY,actor_id INTEGER,role TEXT,assigned_only TEXT)"
            _ <- Store.execute_ cn "INSERT OR IGNORE INTO temp.request_context VALUES (1,NULL,NULL,'false')"
            let readOnly = Wai.requestMethod req `elem` ["GET","HEAD","OPTIONS"]
                login = Wai.requestMethod req == "POST" && Wai.pathInfo req == ["api","auth","login"]
                -- Login counters are atomic upserts; bcrypt runs without a write transaction.
                transaction = if login then (\_ action -> action) else if readOnly then Store.withReadTransaction else Store.withTransaction
                clear = do
                  _ <- Store.execute_ cn "UPDATE temp.request_context SET actor_id=NULL,role=NULL,assigned_only='false' WHERE id=1"
                  if readOnly || login then pure () else do
                    _ <- Store.execute_ cn "UPDATE main.request_context SET actor_id=NULL,role=NULL,assigned_only='false' WHERE id=1"
                    pure ()
            result <- transaction cn $ do
              clear
              ref <- newIORef Nothing
              _ <- application req (\response -> writeIORef ref (Just response) >> pure ResponseReceived)
              clear
              readIORef ref
            case result of
              Just response -> respond response
              Nothing -> respond (jsonError status500 "Empty response"))
        `catch` \(e :: Store.SQLError) -> do
          let code = Store.sqlError e
              status | code == Store.ErrorConstraint = status409
                     | code == Store.ErrorMismatch = status400
                     | otherwise = status503
              message | status == status409 = "A matching record already exists"
                      | status == status400 = "Invalid record values or references"
                      | otherwise = "Database temporarily unavailable"
          putStrLn ("[database] state=" ++ show code)
          respond (jsonError status message)

jsonError :: Status -> T.Text -> Wai.Response
jsonError status message = Wai.responseLBS status [("Content-Type","application/json")] (A.encode (A.object ["error" A..= message]))

operational :: Config -> Wai.Middleware
operational cfg application req respond = do
  started <- getCurrentTime
  consumed <- newIORef (0::Int)
  let finish response = do
        ended <- getCurrentTime
        BL.putStr (A.encode (A.object ["method" A..= TE.decodeUtf8 (Wai.requestMethod req),"path" A..= Wai.pathInfo req,"status" A..= statusCode (Wai.responseStatus response),"durationMs" A..= (realToFrac (diffUTCTime ended started)*1000::Double)]) <> "\n")
        hFlush stdout
        let security = [("X-Content-Type-Options","nosniff"),("Referrer-Policy","no-referrer"),("X-Frame-Options","DENY"),("Cache-Control","no-store"),("Content-Security-Policy","default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")]
            tls = if cfgProduction cfg then [("Strict-Transport-Security","max-age=31536000; includeSubDomains")] else []
        respond (Wai.mapResponseHeaders (\headers -> security ++ tls ++ headers) response)
      unsafe = Wai.requestMethod req `notElem` ["GET","HEAD","OPTIONS"]
      origin = lookup "Origin" (Wai.requestHeaders req)
      crossSite = lookup "Sec-Fetch-Site" (Wai.requestHeaders req) == Just "cross-site"
      canonical = either (const (cfgPublicUrl cfg)) id (normalizePublicUrl (cfgPublicUrl cfg))
      wrongContract = maybe False (/= TE.encodeUtf8 releaseContract) (lookup "X-ECC-Contract" (Wai.requestHeaders req))
      wrongOrigin = maybe False (/= TE.encodeUtf8 canonical) origin
      limitedRead = do
        chunk <- Wai.getRequestBodyChunk req
        total <- atomicModifyIORef' consumed (\n -> let count=n+fromIntegral (BL.length (BL.fromStrict chunk)) in (count,count))
        if total > 27*1024*1024 then ioError (userError "request-body-limit") else pure chunk
      tooLarge = case Wai.requestBodyLength req of Wai.KnownLength n -> n>27*1024*1024; Wai.ChunkedBody -> False
  if unsafe && (crossSite || wrongOrigin) then finish (jsonError status403 "Forbidden origin")
  else if unsafe && wrongContract then finish (jsonError status426 "This page belongs to another application version. Copy any unsaved text, then reload before saving.")
  else if tooLarge then finish (jsonError status413 "Request body too large")
  else if Wai.pathInfo req == ["api","health"] then finish (Wai.responseLBS status200 [("Content-Type","application/json")] "{\"status\":\"ok\"}")
  else application (Wai.setRequestBodyChunks limitedRead req) finish `catch` \(e :: SomeException) ->
    if "request-body-limit" `T.isInfixOf` T.pack (show e) then finish (jsonError status413 "Request body too large")
    else do
      putStrLn "[error] unhandled request exception"
      finish (jsonError status500 "Unexpected server error")

staticFiles :: FilePath -> Wai.Middleware
staticFiles root api req respond = case Wai.pathInfo req of
  ("api":_) -> api req respond
  segments -> do
    let safe = all (\segment -> segment /= ".." && segment /= "." && not (T.any (`elem` ['/', '\\', '\0']) segment)) segments
        rel = T.unpack (T.intercalate "/" segments)
        candidate = if null rel then root ++ "/index.html" else root ++ "/" ++ rel
    exists <- if safe then doesFileExist candidate else pure False
    let asset = any (`isSuffixOf` rel) [".js",".css",".png",".svg",".ico",".webmanifest"]
    if not safe || (asset && not exists) then respond (jsonError status404 "Not found") else do
      let fp = if exists then candidate else root ++ "/index.html"
          mime | ".webmanifest" `isSuffixOf` fp = "application/manifest+json"
               | ".css" `isSuffixOf` fp = "text/css; charset=utf-8"
               | ".js" `isSuffixOf` fp = "application/javascript"
               | ".svg" `isSuffixOf` fp = "image/svg+xml"
               | ".png" `isSuffixOf` fp = "image/png"
               | otherwise = "text/html; charset=utf-8"
      respond (Wai.responseFile status200 [("Content-Type",mime),("Cache-Control","no-cache")] fp Nothing)

-- No queue of slow body readers: uploads have their own bounded capacity.
-- Database/application capacity is acquired only after the body has arrived.
withPermit :: IORef Int -> IO a -> IO a -> IO a
withPermit permits busy action = bracket acquire release (\ok -> if ok then action else busy)
 where
 acquire = atomicModifyIORef' permits (\n -> if n>0 then (n-1,True) else (n,False))
 release ok = if ok then atomicModifyIORef' permits (\n -> (n+1,())) else pure ()

boundedBodies :: Int -> Int -> IO Wai.Middleware
boundedBodies slots deadlineMicros = do
 permits <- newIORef (max 1 slots)
 smallPermits <- newIORef (max 1 slots)
 pure $ \application req respond ->
  let hasBody = case Wai.requestBodyLength req of Wai.KnownLength n -> n>0; Wai.ChunkedBody -> True
      bulk = maybe False (\content -> "multipart/" `B.isPrefixOf` content) (lookup "Content-Type" (Wai.requestHeaders req)) || case Wai.requestBodyLength req of Wai.KnownLength n -> n>65536; Wai.ChunkedBody -> True
      busy = respond (Wai.responseLBS status503 [("Content-Type","application/json"),("Retry-After","1")] "{\"error\":\"Upload capacity busy. Try again shortly.\"}")
      readBody = do
       result <- timeout (if bulk then deadlineMicros else min deadlineMicros 3000000) (Wai.strictRequestBody req)
       case result of
        Nothing -> respond (jsonError status408 "Request body took too long")
        Just bytes -> do
         remaining <- newIORef (BL.toChunks bytes)
         application (Wai.setRequestBodyChunks (atomicModifyIORef' remaining (\chunks -> case chunks of [] -> ([],mempty); x:xs -> (xs,x))) req) respond
  in if hasBody then withPermit (if bulk then permits else smallPermits) busy readBody else application req respond
