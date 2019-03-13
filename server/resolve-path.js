'use strict';

const fs = require('fs');
const path = require('path');

const {promisify} = require('util');

module.exports = (name) => {
    check(name);
    
    const dir = `node_modules/${name}`;
    
    const inner = resolveModule(__dirname, '../', dir);
    const outer = resolveModule(__dirname, '../../', name);
    
    return Promise.resolve()
        .then(inner)
        .catch(outer)
};

function check(name) {
    if (typeof name !== 'string')
        throw Error('name should be string!');
}

function resolveModule(...dirs) {
    /* stat: not global becouse of tests */
    const stat = promisify(fs.stat);
    const dir = path.resolve.apply(null, dirs);
    const getDir = () => dir;
    
    return () => stat(dir).then(getDir);
}

