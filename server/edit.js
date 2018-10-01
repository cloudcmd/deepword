'use strict';

const readjson = require('readjson');

const Edit = require('../json/edit.json');
const HOME = require('os').homedir();

module.exports = (req, res, next) => {
    if (req.url !== '/edit.json')
        return next();
    
    readEdit((error, data) => {
        if (error)
            return res.status(404)
                .send(error.message);
        
        res .type('json')
            .send(data);
    });
}

function replace(from, to) {
    return {
        ...to,
        ...from,
    };
}

function copy(from) {
    return {
        ...from,
    };
}

function readEdit(callback) {
    const homePath = HOME + '/.deepword.json';
    
    readjson(homePath, (error, edit) => {
        const data = copy(Edit);
        
        if (!error)
            return callback(null, replace(edit, data));
        
        if (error.code !== 'ENOENT')
            return callback(Error(`edward --config ${homePath}: ${error.message}`));
        
        callback(null, data);
    });
}

