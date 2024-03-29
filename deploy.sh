#!/bin/bash

pushd client/
npm run-script build
popd
pushd ./release
rm *.js
rm -r ./public
popd

cp ./server/index.js ./release/index.js
cp ./server/routes.js ./release/routes.js
cp ./server/DatabaseClient.js ./release/DatabaseClient.js
cp ./server/nba.js ./release/nba.js
cp ./server/package.json ./release/package.json
cp ./server/package-lock.json ./release/package-lock.json
cp -r ./client/dist/ang-personal-website ./release/
mv ./release/ang-personal-website ./release/public