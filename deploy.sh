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
cp ./server/localDb.js ./release/localDb.js
cp ./server/package.json ./release/package.json
cp ./client/dist/ang-personal-website -R ./release/
mv ./release/ang-personal-website ./release/public