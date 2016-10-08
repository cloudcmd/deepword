'use strict';

const modeForExt = require('./mode-for-ext');
const test = require('tape');

test('mode-for-ext: args: ext', (t) => {
    t.throws(modeForExt, /ext should be string!/, 'should throw when ext not string ');
    t.end();
});

test('mode-for-ext: args: langs', (t) => {
    const fn = () => modeForExt('');
    
    t.throws(fn, /langs should be an array!/, 'should throw when langs not array');
    t.end();
});


test('mode-for-ext: found', (t) => {
    const langs = [{
        id: 'javascript',
        extensions: ['.js']
    }];
    
    t.equal(modeForExt('.js', langs), 'javascript', 'should return name of a language');
    
    t.end();
});

test('mode-for-ext: not found', (t) => {
    const langs = [{
        id: 'c',
        extensions: ['.cpp']
    }];
    
    t.equal(modeForExt('.js', langs), '', 'should return empty string');
    
    t.end();
});

