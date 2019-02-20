const addId = (a) => {
    a.id = `deepword.action.${a.id}`;
    return a;
};

export default function _addCommands() {
    const {_monaco, _eddy} = this;
    const {KeyCode, KeyMod} = _monaco;
    
    const addAction = _eddy.addAction.bind(_eddy);
    const evaluate = this.evaluate.bind(this);
    const goToLine = this.goToLine.bind(this);
    const save = this.save.bind(this);
    const minify = this.minify.bind(this);
    const beautify = this.beautify.bind(this);
    
    const run = (fn) => () => this.isKey() && fn();
    
    const {
        KEY_B,
        KEY_E,
        KEY_G,
        KEY_M,
        KEY_S,
    } = KeyCode;
    
    const {
        CtrlCmd,
        WinCtrl
    } = KeyMod;
    
    const actions = [{
        id: 'evaluate',
        label: 'Evaluate',
        keybindings: [CtrlCmd | KEY_E, WinCtrl | KEY_E],
        run: run(evaluate)
    }, {
        id: 'goToLine',
        label: 'Go To Line',
        keybindings: [CtrlCmd | KEY_G, WinCtrl | KEY_G],
        run: goToLine
    }, {
        id: 'save',
        label: 'Save',
        keybindings: [CtrlCmd | KEY_S, WinCtrl | KEY_S],
        run: run(save)
    }, {
        id: 'minify',
        label: 'Minify',
        keybindings: [CtrlCmd | KEY_M, WinCtrl | KEY_M],
        run: run(minify)
    }, {
        id: 'beautify',
        label: 'Beautify',
        keybindings: [CtrlCmd | KEY_B, WinCtrl | KEY_B],
        run: run(beautify)
    }];
    
    actions
        .map(addId)
        .forEach(addAction);
}

