'use strict';

import path from 'path';
const byExtension = (ext) => ({extensions}) => {
    return ~extensions.indexOf(ext);
}

export default (name, langs) => {
    const ext = path.extname(name);
    
    return langs
        .filter(byExtension(ext))
        .pop();
};

