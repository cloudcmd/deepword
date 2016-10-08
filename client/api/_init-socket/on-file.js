'use strict';

import {extname} from 'path';

import currify from 'currify';
import modeForExt from '../../../common/mode-for-ext';

const modeForPath = (name, langs) => {
    return modeForExt(extname(name), langs);
};

export default currify((monaco, eddy, name, data) => {
    const {languages} = monaco;
    const {createModel} = monaco.editor;
    
    const mode = modeForPath(name, languages.getLanguages());
    
    const oldModel = eddy.getModel();
    const model = createModel(data, mode);
    
    eddy.setModel(model);
    eddy.focus();
    
    oldModel.dispose();
});

