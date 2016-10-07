'use strict';

const modeForPath = require('./mode-for-path');
const test = require('tape');

test('mode-for-path: args: name', (t) => {
    t.throws(modeForPath, /name should be string!/, 'should throw when name not string ');
    t.end();
});

test('mode-for-path: args: langs', (t) => {
    const fn = () => modeForPath('');
    
    t.throws(fn, /langs should be an array!/, 'should throw when langs not array');
    t.end();
});


test('mode-for-path: found', (t) => {
    const langs = [{
        id: 'javascript',
        extensions: ['.js']
    }];
    
    t.equal(modeForPath('hello.js', langs), 'javascript', 'should return name of a language');
    
    t.end();
});

test('mode-for-path: not found', (t) => {
    const langs = [{
        id: 'c',
        extensions: ['.cpp']
    }];
    
    t.equal(modeForPath('hello.js', langs), '', 'should return empty string');
    
    t.end();
});

