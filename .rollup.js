import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';

const noop = () => {};
const onlyIf = (a, plugin) => a ? plugin : noop;

const {NODE_ENV} = process.env;
const isProd = NODE_ENV === 'production';

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        commonjs({
            include: [
                'common/**',
                'node_modules/**',
            ]
        }),
        onlyIf(isProd, babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        })),
        nodeResolve(),
        builtins(),
        postcss({
            extenstions: ['.css']
        }),
        onlyIf(isProd, uglify())
    ]
};
