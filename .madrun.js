'use strict';

const {run} = require('madrun');

module.exports = {
    'start': () => 'bin/deepword.js package.json',
    'start:dev': () => 'NODE_ENV=development npm start',
    'test': () => 'tape \'{client,common,server}/**/*.spec.js\'',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'watcher:test': () => 'nodemon -e spec.js -w client -w server -w common -x ',
    'fix:lint': () => run('lint', '--fix'),
    'lint': () => 'putout bin client server common .madrun.js webpack.config.js',
    'wisdom': () => run('build'),
    'build': () => run(['clean', 'mkdir', 'build:client*', 'cp:*']),
    'cp:socket.io:dist': () => 'cp node_modules/socket.io-client/dist/socket.io.js dist/socket.io.js',
    'cp:socket.io:dist-dev': () => 'cp node_modules/socket.io-client/dist/socket.io.js dist-dev/socket.io.js',
    'cp:socket.io.map:dist': () => 'cp node_modules/socket.io-client/dist/socket.io.js.map dist/socket.io.js.map',
    'cp:socket.io.map:dist-dev': () => 'cp node_modules/socket.io-client/dist/socket.io.js.map dist-dev/socket.io.js.map',
    'build-progress': () => 'webpack --progress',
    'build:client': () => run('build-progress', '--mode production'),
    'build:start': () => run(['build:client', 'start']),
    'build:client:dev': () => `NODE_ENV=development ${run('build-progress')} --mode development`,
    'build:start:dev': () => run(['build:client:dev', 'start:dev']),
    'watch:client': () => `nodemon -w client -x "${run('build:client')}"`,
    'watch:client:dev': () => `NODE_ENV=development "${run('watch:client')}"`,
    'mkdir': () => 'mkdirp dist dist-dev',
    'clean': () => 'rimraf dist dist-dev',
};

