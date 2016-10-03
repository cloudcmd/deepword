import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';

import {minify} from 'uglify-js'

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        commonjs({
            include: 'node_modules/**'
        }),
        nodeResolve({
            exnext: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        //uglify({}, minify)
    ]
};

