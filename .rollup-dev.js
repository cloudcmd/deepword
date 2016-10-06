import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import builtins from 'rollup-plugin-node-builtins';

import {minify} from 'uglify-js'

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
        commonjs({
            include: [
                'node_modules/**',
                'client/**'
            ]
        }),
        nodeResolve(),
        builtins(),
        postcss({
            extenstions: ['.css']
        })
    ]
};

