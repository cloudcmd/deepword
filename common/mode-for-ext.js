'use strict';

const currify = require('currify');

const byExtension = currify((ext, options) => {
    const {extensions} = options;
    return extensions.includes(ext);
});

module.exports = (ext, langs) => {
    check(ext, langs);
    
    const empty = {
        id: '',
    };
    
    const mode = langs
        .filter(byExtension(ext))
        .pop();
    
    return (mode || empty).id;
};

function check(ext, langs) {
    if (typeof ext !== 'string')
        throw Error('ext should be string!');
    
    if (!Array.isArray(langs))
        throw Error('langs should be an array!');
}

