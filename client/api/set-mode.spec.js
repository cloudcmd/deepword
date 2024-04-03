import {test, stub} from 'supertape';
import setMode from './set-mode.js';

test('client: setMode: return this', (t) => {
    const ctx = getContext();
    
    t.equal(setMode.call(ctx), ctx, 'should return this');
    t.end();
});

test('client: setMode: getValue', (t) => {
    const ctx = getContext();
    
    const {getValue} = ctx;
    setMode.call(ctx);
    
    t.calledWithNoArgs(getValue, 'should call getValue');
    t.end();
});

test('client: setMode: createModel', (t) => {
    const ctx = getContext();
    const value = 'hello';
    
    ctx.getValue.returns(value);
    
    const {createModel} = ctx._monaco.editor;
    const mode = 'javascript';
    
    setMode.call(ctx, mode);
    
    t.calledWith(createModel, [value, mode], 'should call createModel');
    t.end();
});

test('client: setMode: setModel', (t) => {
    const ctx = getContext();
    const model = 'model';
    
    ctx._monaco.editor.createModel.returns(model);
    
    const {setModel} = ctx._eddy;
    
    setMode.call(ctx);
    
    t.calledWith(setModel, [model], 'should call setModel');
    t.end();
});

test('client: setMode: focus', (t) => {
    const ctx = getContext();
    const {focus} = ctx._eddy;
    
    setMode.call(ctx);
    
    t.calledWithNoArgs(focus, 'should call focus');
    t.end();
});

function getContext() {
    const focus = stub();
    const setModel = stub();
    const _eddy = {
        setModel,
        focus,
    };
    
    const createModel = stub();
    
    const editor = {
        createModel,
    };
    
    const _monaco = {
        editor,
    };
    
    const getValue = stub();
    
    return {
        _monaco,
        _eddy,
        getValue,
    };
}
