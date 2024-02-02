import {createRequire} from 'node:module';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process, {env} from 'node:process';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const dir = './client';
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';

process.env.NODE_DEBUG = '';

const rules = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
}, {
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
        'clean-css-loader',
    ],
}, {
    test: /\.(png)$/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 50_000,
        },
    },
}, {
    test: /\.ttf$/,
    use: ['file-loader'],
}];

export default {
    devtool,
    entry: {
        deepword: `${dir}/index.js`,
    },
    output: {
        library: 'deepword',
        filename: '[name].js',
        path: isDev ? distDev : dist,
        pathinfo: isDev,
        libraryTarget: 'var',
        libraryExport: 'default',
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            util: require.resolve('util'),
        },
    },
    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
            'NODE_DEBUG',
        ]),
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
        }),
        new MiniCssExtractPlugin(),
    ],
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://deepword/${resource}`;
}
