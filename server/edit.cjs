'use strict';

const readjson = require('readjson');
const tryToCatch = require('try-to-catch');

const Edit = require('../json/edit.json');
const HOME = require('os').homedir();

module.exports = async (req, res, next) => {
    if (req.url !== '/edit.json')
        return next();
    
    const [error, data] = await tryToCatch(readEdit);
    
    if (error)
        return res
            .status(404)
            .send(error.message);
    
    res
        .type('json')
        .send(data);
};

async function readEdit() {
    const homePath = `${HOME}/.deepword.json`;
    const [error, edit] = await tryToCatch(readjson, homePath);
    
    if (!error)
        return {
            ...Edit,
            ...edit,
        };
    
    if (error.code !== 'ENOENT')
        throw Error(`deepword --config ${homePath}: ${error.message}`);
    
    return Edit;
}
