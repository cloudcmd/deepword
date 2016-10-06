import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
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
            exclude: 'node_modules/**'
        }),
        commonjs({
            include: [
                'node_modules/**',
                'client/**'
            ]
        }),
        nodeResolve(),
        builtins(),
        uglify({}, minify),
        postcss({
            extenstions: ['.css']
        })
    ]
};

