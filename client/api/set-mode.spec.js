'use strict';

const test = require('tape');
const stub = require('@cloudcmd/stub');

const setMode = require('./set-mode');

test('client: setMode: return this', (t) => {
    const ctx = getContext();
    
    t.equal(setMode.call(ctx), ctx, 'should return this');
    t.end();
});

test('client: setMode: getValue', (t) => {
    const ctx = getContext();
    
    const {getValue} = ctx;
    setMode.call(ctx)
    
    t.ok(getValue.calledWith(), 'should call getValue');
    t.end();
});

test('client: setMode: createModel', (t) => {
    const ctx = getContext();
    const value = 'hello';
    
    ctx.getValue.returns(value);
    
    const {createModel} = ctx._monaco.editor;
    const mode = 'javascript';
    
    setMode.call(ctx, mode)
    
    t.ok(createModel.calledWith(value, mode), 'should call createModel');
    t.end();
});

test('client: setMode: setModel', (t) => {
    const ctx = getContext();
    const model = 'model';
    
    ctx._monaco.editor.createModel.returns(model);
    
    const {setModel} = ctx._eddy;
    
    setMode.call(ctx)
    
    t.ok(setModel.calledWith(model), 'should call setModel');
    t.end();
});

test('client: setMode: focus', (t) => {
    const ctx = getContext();
    const {focus} = ctx._eddy;
    
    setMode.call(ctx)
    
    t.ok(focus.calledWith(), 'should call focus');
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
        createModel
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

