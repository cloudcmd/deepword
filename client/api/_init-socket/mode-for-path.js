'use strict';

const path = require('path');

const byExtension = (ext) => ({extensions}) => {
    return ~extensions.indexOf(ext);
}

module.exports.a = (name, langs) => {
    check(name, langs);
    
    const ext = path.extname(name);
    const empty = {
        id: ''
    }
    
    const [mode] = langs.filter(byExtension(ext));
    
    return (mode || empty).id
};

function check(name, langs) {
    if (typeof name !== 'string')
        throw Error('name should be string!');
    
    if (!Array.isArray(langs))
        throw Error('langs should be an array!');
}
