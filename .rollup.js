import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const noop = () => {};
const onlyIf = (a, plugin) => a ? plugin : noop;

const {NODE_ENV} = process.env;
const isProd = NODE_ENV === 'production';

export default {
    entry: 'client/index.js',
    moduleName: 'deepword',
    plugins: [
        builtins(),
        nodeResolve(),
        commonjs({
            preferBuiltins: true,
            include: [
                'common/**',
                'node_modules/**',
            ],
            namedExports: {
                'restafary': [
                    'read',
                    'write',
                    'patch'
                ]
            }
        }),
        onlyIf(isProd, babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        })),
        postcss({
            extenstions: ['.css']
        }),
        onlyIf(isProd, uglify()),
        onlyIf(isProd, filesize()),
    ]
};
