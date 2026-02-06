import {createRequire} from 'node:module';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process, {env} from 'node:process';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = './client';
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';
const notEmpty = (a) => a;
const clean = (array) => array.filter(notEmpty);
const {resolve} = createRequire(import.meta.url);

const {NODE_ENV} = process.env;

process.env.NODE_DEBUG = '';
process.env.NODE_ENV = NODE_ENV || '';

const rules = clean([{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
}, {
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
        'clean-css-loader', {
            loader: 'clean-css-loader',
            options: {
                skipWarn: true,
            },
        }],
}, {
    test: /\.(png|gif|svg|woff|woff2|eot|ttf)$/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 50_000,
        },
    },
}]);

export default {
    devtool,
    entry: {
        deepword: `${dir}/index.js`,
    },
    output: {
        library: {
            name: 'deepword',
            export: 'default',
            type: 'var',
        },
        filename: '[name].js',
        path: isDev ? distDev : dist,
        pathinfo: isDev,
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
    resolve: {
        fallback: {
            path: resolve('path-browserify'),
            util: resolve('util'),
        },
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
            'NODE_DEBUG',
        ]),
    ],
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://deepword/${resource}`;
}
