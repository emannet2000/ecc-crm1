{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE FlexibleInstances #-}
{-# OPTIONS_GHC -Wno-orphans #-}
module ECC.Store
  ( Connection, Query(..), Only(..), ToRow, FromRow
  , SQLError(..), Error(..), Binary(..), query, query_, execute, execute_
  , returning, withTransaction, withReadTransaction, openDatabase, close, execScript ) where
import qualified Database.SQLite.Simple as S
import Database.SQLite.Simple (Connection, Query(..), Only(..), ToRow(..), FromRow(..), SQLError(..), Error(..), query, query_, close)
import Database.SQLite.Simple.FromField
import Database.SQLite.Simple.ToField
import qualified Database.SQLite3 as SQLite
import qualified Data.Aeson as A
import qualified Data.ByteString as B
import qualified Data.ByteString.Lazy as BL
import qualified Data.Text as T
import qualified Data.Text.Encoding as TE
import Data.Int (Int64)
import ECC.Clock (businessZone, zoneModifier)
import Control.Monad (forM, void)

newtype Binary a = Binary a
instance ToField (Binary B.ByteString) where toField (Binary bytes) = S.SQLBlob bytes
instance FromField (Binary B.ByteString) where fromField field = Binary <$> fromField field
instance FromField A.Value where
  fromField field = do
    value <- fromField field
    case A.eitherDecodeStrict (TE.encodeUtf8 value) of
      Right parsed -> pure parsed
      Left message -> returnError ConversionFailed field message
instance ToField A.Value where toField = S.SQLText . TE.decodeUtf8 . BL.toStrict . A.encode

execute :: ToRow q => Connection -> Query -> q -> IO Int64
execute conn sql params = S.execute conn sql params >> fromIntegral <$> S.changes conn
execute_ :: Connection -> Query -> IO Int64
execute_ conn sql = S.execute_ conn sql >> fromIntegral <$> S.changes conn
returning :: ToRow q => Connection -> Query -> [q] -> IO [[Int]]
returning conn sql rows = forM rows $ \row -> map S.fromOnly <$> (S.query conn sql row :: IO [Only Int])
withTransaction :: Connection -> IO a -> IO a
withTransaction = S.withImmediateTransaction
withReadTransaction :: Connection -> IO a -> IO a
withReadTransaction = S.withTransaction
execScript :: Connection -> T.Text -> IO ()
execScript conn = SQLite.exec (S.connectionHandle conn)
openDatabase :: FilePath -> IO Connection
openDatabase path = do
  zone <- businessZone
  conn <- S.open path
  SQLite.createFunction (S.connectionHandle conn) "business_offset" (Just 0) True (\ctx _ -> SQLite.funcResultText ctx (zoneModifier zone))
  S.execute_ conn "PRAGMA busy_timeout=10000"
  _ <- (S.query_ conn "PRAGMA journal_mode=WAL" :: IO [Only T.Text])
  S.execute_ conn "PRAGMA foreign_keys=ON"
  S.execute_ conn "PRAGMA synchronous=FULL"
  pure conn

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k) => FromRow (a,b,c,d,e,f,g,h,i,j,k) where
  fromRow = (,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k) => ToRow (a,b,c,d,e,f,g,h,i,j,k) where
  toRow (a,b,c,d,e,f,g,h,i,j,k) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l) where
  fromRow = (,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l, FromField m) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l,m) where
  fromRow = (,,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l, ToField m) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l,m) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l,m) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l, toField m]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l, FromField m, FromField n) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n) where
  fromRow = (,,,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l, ToField m, ToField n) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l, toField m, toField n]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l, FromField m, FromField n, FromField o) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) where
  fromRow = (,,,,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l, ToField m, ToField n, ToField o) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l, toField m, toField n, toField o]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l, FromField m, FromField n, FromField o, FromField p) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) where
  fromRow = (,,,,,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l, ToField m, ToField n, ToField o, ToField p) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l, toField m, toField n, toField o, toField p]

instance (FromField a, FromField b, FromField c, FromField d, FromField e, FromField f, FromField g, FromField h, FromField i, FromField j, FromField k, FromField l, FromField m, FromField n, FromField o, FromField p, FromField q) => FromRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q) where
  fromRow = (,,,,,,,,,,,,,,,,) <$> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field <*> S.field
instance (ToField a, ToField b, ToField c, ToField d, ToField e, ToField f, ToField g, ToField h, ToField i, ToField j, ToField k, ToField l, ToField m, ToField n, ToField o, ToField p, ToField q) => ToRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q) where
  toRow (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q) = [toField a, toField b, toField c, toField d, toField e, toField f, toField g, toField h, toField i, toField j, toField k, toField l, toField m, toField n, toField o, toField p, toField q]
