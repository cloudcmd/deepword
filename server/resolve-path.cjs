'use strict';

const path = require('path');
const {stat} = require('fs/promises');

const tryToCatch = require('try-to-catch');
const isString = (a) => typeof a === 'string';

module.exports = async (name) => {
    check(name);
    
    const dir = `node_modules/${name}`;
    const [e, inner] = await tryToCatch(resolveModule, __dirname, '../', dir);
    
    if (!e)
        return inner;
    
    return await resolveModule(__dirname, '../../', name);
};

function check(name) {
    if (!isString(name))
        throw Error('name should be string!');
}

async function resolveModule(...dirs) {
    const dir = path.resolve(...dirs);
    
    await stat(dir);
    
    return dir;
}
