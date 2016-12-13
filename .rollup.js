import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import nano from 'cssnano';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import globals from 'rollup-plugin-node-globals';

const noop = () => {};
const onlyIf = (a, plugin) => a ? plugin : noop;

const {NODE_ENV} = process.env;
const isProd = NODE_ENV === 'production';

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        postcss({
            plugins: [
                nano
            ],
        }),
        commonjs({
            include: [
                'common/**',
                'node_modules/**',
            ],
            namedExports: {
                'node_modules/restafary/lib/client.js': [
                    'read',
                    'write',
                    'patch',
                    'prefix',
                ],
                'load.js': [
                    'js',
                    'json',
                    'parallel',
                    'series',
                ],
                'socket.io': [
                    'connect'
                ],
                'smalltalk/legacy': [
                    'alert',
                    'prompt',
                    'confirm'
                ],
                'daffy': [
                    'applyPatch',
                    'createPatch'
                ]
            }
        }),
        nodeResolve({
            preferBuiltins: true,
            browser: true,
        }),
        builtins(),
        globals(),
        json(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            externalHelpers: true
        }),
        onlyIf(isProd, uglify()),
        onlyIf(isProd, filesize()),
    ]
};

