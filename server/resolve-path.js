'use strict';

const fs = require('fs');
const path = require('path');

const Promise = require('promise-polyfill');
const pify = require('pify');

module.exports = (name) => {
    check(name);
    
    const dir = `node_modules/${name}`;
    
    const inner = resolveModule(__dirname, '../', dir);
    const outer = resolveModule(__dirname, '../../', dir);
    
    return Promise.resolve()
        .then(inner)
        .catch(outer)
};

function check(name) {
    if (typeof name !== 'string')
        throw Error('name should be string!');
}

function resolveModule(...dirs) {
    const dir = path.resolve(...dirs);
    const getDir = () => dir;
    const stat = pify(fs.stat);
    
    return () => stat(dir).then(getDir);
}

