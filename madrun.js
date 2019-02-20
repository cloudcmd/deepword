'use strict';

const {
    run,
    series,
    parallel,
} = require('madrun');

module.exports = {
    "start": () => 'bin/deepword.js package.json',
    "start:dev": () => 'NODE_ENV=development npm start',
    "test": () => 'tape \'{client,common,server}/**/*.spec.js\'',
    "coverage": () => 'nyc npm test',
    "report": () => 'nyc report --reporter=text-lcov | coveralls',
    "watcher:test": () => 'nodemon -e spec.js -w client -w server -w common -x ',
    "lint": () => series(['putout', 'lint:*']),
    "fix:lint": () => series(['putout', 'lint:*'], '--fix'),
    'putout': () => 'putout bin client server common',
    "lint:bin": () => 'eslint --rule \'no-console:0\' --config .eslintrc.server bin',
    "lint:client": () => 'eslint --config .eslintrc.client client',
    "lint:server": () => 'eslint --config .eslintrc.server server common --ignore-pattern *.spec.js',
    "wisdom": () => series(['build']),
    "build": () => series(['clean', 'mkdir', 'build:client*', 'cp:*']),
    "cp:socket.io:dist": () => 'cp node_modules/socket.io-client/dist/socket.io.js dist/socket.io.js',
    "cp:socket.io:dist-dev": () => 'cp node_modules/socket.io-client/dist/socket.io.js dist-dev/socket.io.js',
    "cp:socket.io.map:dist": () => 'cp node_modules/socket.io-client/dist/socket.io.js.map dist/socket.io.js.map',
    "cp:socket.io.map:dist-dev": () => 'cp node_modules/socket.io-client/dist/socket.io.js.map dist-dev/socket.io.js.map',
    "build-progress": () => 'webpack --progress',
    "build:client": () => series(['build-progress'], '--mode production'),
    "build:start": () => series(['build:client', 'start']),
    "build:client:dev": () => 'NODE_ENV=development npm run build-progress -- --mode development',
    "build:start:dev": () => series(['build:client:dev', 'start:dev']),
    "watch:client": () => 'nodemon -w client -x "npm run build:client"',
    "watch:client:dev": () => 'NODE_ENV=development npm run watch:client',
    "mkdir": () => 'mkdirp dist dist-dev',
    "clean": () => 'rimraf dist dist-dev'
};

