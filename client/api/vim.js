import {initVimMode} from 'monaco-vim';

let vimMode;

export const disableVim = () => {
    if (!vimMode)
        return;
    
    vimMode.dispose();
};

export const enableVim = (editor, el) => {
    const statusEl = el.querySelector('#deepword-vim');
    statusEl.innerHTML = '';
    
    vimMode = initVimMode(editor, statusEl);
};

