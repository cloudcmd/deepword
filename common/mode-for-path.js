'use strict';

const path = require('path');

const byExtension = (ext) => ({extensions}) => {
    return ~extensions.indexOf(ext);
}

export default (name, langs) => {
    const ext = path.extname(name);
    const empty = {
        id: ''
    }
    
    const [mode] = langs.filter(byExtension(ext));
    
    return (mode || empty).id
};

