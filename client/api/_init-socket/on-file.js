'use strict';

import currify from 'currify';
import modeForPath from 'mode-for-path';

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

