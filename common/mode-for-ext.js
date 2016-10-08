'use strict';

const byExtension = (ext) => ({extensions}) => {
    return ~extensions.indexOf(ext);
};

//export default (ext, langs) => {
module.exports = (ext, langs) => {
    check(ext, langs);
    
    const empty = {
        id: ''
    }
    
    const [mode] = langs.filter(byExtension(ext));
    
    return (mode || empty).id
};

function check(ext, langs) {
    if (typeof ext!== 'string')
        throw Error('ext should be string!');
    
    if (!Array.isArray(langs))
        throw Error('langs should be an array!');
}

