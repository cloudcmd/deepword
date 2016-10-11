'use strict';

import {extname} from 'path';

import currify from 'currify';
import modeForExt from '../../common/mode-for-ext';

const modeForPath = (name, langs) => {
    return modeForExt(extname(name), langs);
};

export default function setModeForPath(name) {
    const {_monaco, _eddy} = this;
    
    const {languages} = monaco;
    const {createModel} = monaco.editor;
    
    const mode = modeForPath(name, languages.getLanguages());
    
    const oldModel = _eddy.getModel();
    const value = this.getValue();
    const model = createModel(value, mode);
    
    _eddy.setModel(model);
    _eddy.focus();
    
    oldModel.dispose();
}

