const addId = (a) => {
    a.id = `deepword.action.${a.id}`;
    return a;
};

export default function _addCommands() {
    debugger;
    const {_monaco, _eddy} = this;
    const {KeyCode, KeyMod} = _monaco;
    
    const addAction = _eddy.addAction.bind(_eddy);
    const evaluate = this.evaluate.bind(this);
    const goToLine = this.goToLine.bind(this);
    const save = this.save.bind(this);
    
    const run = (fn) => () => this.isKey() && fn();
    
    const {
        KeyE,
        KeyG,
        KeyS,
    } = KeyCode;
    
    const {
        CtrlCmd,
        WinCtrl,
    } = KeyMod;
    
    const actions = [{
        id: 'evaluate',
        label: 'Evaluate',
        keybindings: [CtrlCmd | KeyE, WinCtrl | KeyE],
        run: run(evaluate),
    }, {
        id: 'goToLine',
        label: 'Go To Line',
        keybindings: [CtrlCmd | KeyG, WinCtrl | KeyG],
        run: goToLine,
    }, {
        id: 'save',
        label: 'Save',
        keybindings: [CtrlCmd | KeyS, WinCtrl | KeyS],
        run: run(save),
    }];
    
    actions
        .map(addId)
        .forEach(addAction);
}

