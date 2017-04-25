'use strict';

import {extname} from 'path';

import modeForExt from '../../common/mode-for-ext';

const modeForPath = (name, langs) => {
    return modeForExt(extname(name), langs);
};

export default function setModeForPath(name) {
    const {_monaco} = this;
    
    const {languages} = _monaco;
    
    const mode = modeForPath(name, languages.getLanguages());
    
    this.setMode(mode);
    
    return this;
}

