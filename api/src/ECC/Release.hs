{-# LANGUAGE OverloadedStrings #-}
module ECC.Release (releaseContract, validateRelease) where

import Control.Monad (forM_, unless)
import qualified Data.Aeson as A
import Data.Aeson ((.:))
import Data.Aeson.Types (parseEither)
import qualified Data.ByteString as B
import qualified Data.Text as T
import qualified Data.Map.Strict as Map
import Data.List (sort, isSuffixOf)
import System.Directory (listDirectory)
import System.FilePath ((</>))
import ECC.Auth (tokenHash)

releaseContract :: T.Text
releaseContract = "ecc-crm-20261019-v1"

validateRelease :: FilePath -> FilePath -> FilePath -> IO ()
validateRelease web migrations binary = do
  bytes <- B.readFile (web </> "release.json")
  value <- either (fail . ("Invalid release manifest: "++)) pure (A.eitherDecodeStrict bytes)
  (contract,verified,backend,assets,schemas) <- either fail pure $ parseEither
    (A.withObject "release" (\o -> (,,,,) <$> o .: "contract" <*> o .: "verified" <*> o .: "backend" <*> o .: "assets" <*> o .: "migrations")) value
  unless (contract==releaseContract && verified) $ fail "Production requires a compatible release that passed the complete quality gate"
  actualBinary <- tokenHash <$> B.readFile binary
  unless (backend==actualBinary) $ fail "The API binary differs from the verified release"
  let expectedAssets = ["index.html","main.js","bootstrap.js","css/app.css"]
  unless (sort (Map.keys assets)==sort expectedAssets) $ fail "Release assets are incomplete"
  diskSchemas <- sort . filter (".sql" `isSuffixOf`) <$> listDirectory migrations
  unless (Map.keys schemas==diskSchemas && not (null diskSchemas) && last diskSchemas=="0014_business_clock.sql") $ fail "Migration files are incompatible with this API release"
  forM_ [(web,assets),(migrations,schemas)] $ \(root,files) ->
    forM_ (Map.toList (files :: Map.Map FilePath T.Text)) $ \(name,expected) -> do
      -- Only enumerated assets/migration filenames reach the filesystem.
      digest <- tokenHash <$> B.readFile (root </> name)
      unless (digest==expected) $ fail ("Release file changed after verification: "++name)
