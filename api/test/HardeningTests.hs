{-# LANGUAGE OverloadedStrings #-}
module HardeningTests (run) where
import Control.Concurrent (forkIO, newEmptyMVar, putMVar, takeMVar, threadDelay)
import Control.Monad (unless, void)
import qualified Data.ByteString as B
import Data.IORef
import qualified Data.Text as T
import qualified Network.Wai as W
import qualified Network.Wai.Test as WT
import Network.Wai.Internal (ResponseReceived(..))
import Network.HTTP.Types
import ECC.Config (normalizePublicUrl)
import ECC.Server (boundedBodies,operational)
import ECC.Config (Config(..))

run :: IO ()
run = do
 let assert label good=unless good(fail label)
 mapM_ (\(raw,expected)->assert "PUBLIC_URL canonical origin" (normalizePublicUrl raw==Right expected))
  [(" https://CRM.Example:443/ ","https://crm.example"),("http://LOCALHOST:80/","http://localhost"),("https://[::1]:444/","https://[::1]:444")]
 mapM_ (\raw->assert "Invalid PUBLIC_URL rejected" (case normalizePublicUrl raw of Left _->True;_->False))
  ["https://user:password@example.com","https://example.com/path","https://example.com?secret=1","https://example.com/#x","ftp://example.com","https://example.com:0","https://"]
 let config=Config 4000 ":memory:" "test-secret-at-least-32-bytes-long" False False 2 "http://localhost:4000" False
     versioned=operational config (\_ respond->respond(W.responseLBS status200 [] "ok"))
 stale<-WT.runSession(WT.srequest(WT.SRequest W.defaultRequest{W.requestMethod="POST",W.requestHeaders=[("X-ECC-Contract","old-version")]} "")) versioned
 assert "Incompatible frontend cannot mutate data" (WT.simpleStatus stale==status426)
 bodyGuard<-boundedBodies 1 1000000
 let downstream _ respond=respond(W.responseLBS status200 [] "ok")
     app=bodyGuard downstream
 started<-newEmptyMVar
 release<-newEmptyMVar
 finished<-newEmptyMVar
 first<-newIORef True
 let readChunk=do
      initial<-atomicModifyIORef' first (\value->(False,value))
      if initial then putMVar started () >> takeMVar release >> pure "x" else pure B.empty
     request=W.setRequestBodyChunks readChunk W.defaultRequest{W.requestMethod="POST",W.requestBodyLength=W.KnownLength 1,W.requestHeaders=[("Content-Type","multipart/form-data")]}
 _<-forkIO $ void $ app request (\response->putMVar finished (W.responseStatus response)>>pure ResponseReceived)
 takeMVar started
 get<-WT.runSession(WT.request W.defaultRequest) app
 assert "Slow upload does not occupy read capacity" (WT.simpleStatus get==status200)
 small<-WT.runSession(WT.srequest(WT.SRequest W.defaultRequest{W.requestMethod="POST",W.requestBodyLength=W.KnownLength 2,W.requestHeaders=[("Content-Type","application/json")]} "{}")) app
 assert "Slow upload does not occupy ordinary JSON body capacity" (WT.simpleStatus small==status200)
 busy<-WT.runSession(WT.srequest(WT.SRequest W.defaultRequest{W.requestMethod="POST",W.requestBodyLength=W.KnownLength 1,W.requestHeaders=[("Content-Type","multipart/form-data")]} "x")) app
 assert "Upload saturation rejects promptly" (WT.simpleStatus busy==status503)
 putMVar release ()
 finalStatus<-takeMVar finished
 assert "Upload can finish normally" (finalStatus==status200)
 shortGuard<-boundedBodies 1 20000
 let slow=W.setRequestBodyChunks (threadDelay 100000 >> pure B.empty) W.defaultRequest{W.requestMethod="POST",W.requestBodyLength=W.KnownLength 1}
 timed<-newEmptyMVar
 _<-shortGuard downstream slow (\response->putMVar timed(W.responseStatus response)>>pure ResponseReceived)
 timeoutStatus<-takeMVar timed
 assert "Slow request has a body deadline" (timeoutStatus==status408)
 after<-WT.runSession(WT.srequest(WT.SRequest W.defaultRequest{W.requestMethod="POST",W.requestBodyLength=W.KnownLength 1} "x")) (shortGuard downstream)
 assert "Timed-out body releases capacity" (WT.simpleStatus after==status200)
 putStrLn (T.unpack "Public URL normalization and bounded upload capacity checks passed")
