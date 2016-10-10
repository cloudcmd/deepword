import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import nano from 'cssnano';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import async from 'rollup-plugin-async';

const noop = () => {};
const onlyIf = (a, plugin) => a ? plugin : noop;

const {NODE_ENV} = process.env;
const isProd = NODE_ENV === 'production';

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        builtins(),
        postcss({
            extenstions: ['.css'],
            plugins: [
                nano
            ],
        }),
        commonjs({
            include: [
                'common/**',
                'node_modules/**',
                'client/**',
            ],
            namedExports: {
                restafary: [
                    'read',
                    'write',
                    'patch'
                ],
                'load.js': [
                    'js',
                    'json',
                    'parallel'
                ],
                'socket.io': [
                    'connect'
                ]
            }
        }),
        nodeResolve({
            preferBuiltins: true,
            browser: true,
            /*
             * ws garbage located in try-catch block
             */
            skip: [
                'bufferutil',
                'utf-8-validate'
            ]
        }),
        json(),
        async(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            externalHelpers: true
        }),
        onlyIf(isProd, uglify()),
        onlyIf(isProd, filesize()),
    ]
};
