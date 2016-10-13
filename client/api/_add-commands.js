'use strict';

const addId = (a) => {
    a.id = a.label;
    return a;
};

export default function _addCommands() {
    const {_monaco, _eddy} = this;
    const {KeyCode, KeyMod} = _monaco;
    
    const addAction = _eddy.addAction.bind(_eddy);
    const goToLine = this.goToLine.bind(this);
    const save = this.save.bind(this);
    const minify = this.minify.bind(this);
    const beautify = this.beautify.bind(this);
    
    const {
        Ctrl,
        KEY_B,
        KEY_G,
        KEY_M,
        KEY_S,
    } = KeyCode;
    
    const {
        CtrlCmd,
        WinCtrl
    } = KeyMod;
    
    const actions = [{
        label: 'Go To Line',
        keybindings: [CtrlCmd | KEY_G, WinCtrl | KEY_G],
        run: goToLine
    }, {
        label: 'Save',
        keybindings: [CtrlCmd | KEY_S, WinCtrl | KEY_S],
        run: save
    }, {
        label: 'Minify',
        keybindings: [CtrlCmd | KEY_M, WinCtrl | KEY_M],
        run: minify
    }, {
        label: 'Beautify',
        keybindings: [CtrlCmd | KEY_B, WinCtrl | KEY_B],
        run: beautify
    }];
    
    actions
        .map(addId)
        .forEach(addAction);
}
