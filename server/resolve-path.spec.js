import path, {dirname} from 'node:path';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {tryToCatch} from 'try-to-catch';
import test from 'supertape';
import resolvePath from './resolve-path.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('resolve-path: args', async (t) => {
    const [e] = await tryToCatch(resolvePath);
    
    t.equal(e.message, 'name should be string!');
    t.end();
});

test('resolve-path: module installed in inner directory', async (t) => {
    const expect = path.resolve(__dirname, '..', 'node_modules/monaco-editor');
    const stat = promisify((name, fn) => {
        fn();
    });
    
    const name = await resolvePath('monaco-editor', {
        stat,
    });
    
    t.equal(name, expect, 'should return path in inner directory');
    t.end();
});

test('resolve-path: module installed in outer directory', async (t) => {
    let onceError = false;
    
    const stat = promisify((name, fn) => {
        if (onceError) {
            fn();
        } else {
            onceError = true;
            fn(Error('some error'));
        }
    });
    
    const name = await resolvePath('monaco', {
        stat,
    });
    
    t.ok(name, 'should return path in outer directory');
    t.end();
});

test('resolve-path: module not installed', async (t) => {
    const stat = promisify((name, fn) => {
        fn(Error());
    });
    
    const [e] = await tryToCatch(resolvePath, 'monaco', {
        stat,
    });
    
    t.ok(e, 'should reject when module not found');
    t.end();
});
