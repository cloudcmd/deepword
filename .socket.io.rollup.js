import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
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
    entry: 'node_modules/socket.io-client/lib/index.js',
    exports: 'named',
    moduleName: 'io',
    plugins: [
        commonjs({
            include: [
                'common/**',
                'node_modules/**',
            ]
        }),
        nodeResolve({
            preferBuiltins: true,
            browser: true,
        }),
        builtins(),
        globals(),
        json(),
        onlyIf(isProd, uglify()),
        onlyIf(isProd, filesize()),
    ]
};

