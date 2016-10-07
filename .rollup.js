import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';
import conditional from 'rollup-plugin-conditional';

import {minify} from 'uglify-js';

const {NODE_ENV} = process.env;

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        commonjs({
            include: [
                'client/**',
                'node_modules/**',
            ]
        }),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
        nodeResolve(),
        builtins(),
        postcss({
            extenstions: ['.css']
        }),
        conditional({
            condition: NODE_ENV === 'production',
            plugin: uglify({}, minify)
        })
    ]
};

