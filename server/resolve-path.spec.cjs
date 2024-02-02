'use strict';

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const tryToCatch = require('try-to-catch');
const test = require('supertape');
const {reRequire} = require('mock-require');

const resolvePath = require('./resolve-path.cjs');

const {stat} = fs.promises;

test('resolve-path: args', async (t) => {
    const [e] = await tryToCatch(resolvePath);
    
    t.equal(e.message, 'name should be string!');
    t.end();
});

test('resolve-path: module installed in inner directory', async (t) => {
    const expect = path.resolve(__dirname, '..', 'node_modules/monaco-editor');
    
    mock();
    
    const name = await resolvePath('monaco-editor');
    
    t.equal(name, expect, 'should return path in inner directory');
    t.end();
    
    unmock();
});

test('resolve-path: module installed in outer directory', async (t) => {
    mockFirstError();
    
    const resolvePath = reRequire('./resolve-path.cjs');
    const name = await resolvePath('monaco');
    
    t.ok(name, 'should return path in outer directory');
    t.end();
    unmock();
});

test('resolve-path: module not installed', async (t) => {
    mock(Error());
    const [e] = await tryToCatch(resolvePath, 'monaco');
    
    t.ok(e, 'should reject when module not found');
    unmock();
    t.end();
});

function mockFirstError() {
    let onceError;
    
    fs.promises.stat = promisify((name, fn) => {
        if (onceError) {
            fn();
        } else {
            onceError = true;
            fn(Error('some error'));
        }
    });
}

function mock(...args) {
    fs.promises.stat = promisify((name, fn) => {
        fn(...args);
    });
}

function unmock() {
    fs.promises.stat = stat;
}
