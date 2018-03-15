'use strict';

const path = require('path');
const webpack = require('webpack');
const {optimize} = webpack;
const dir = './client';

const {env} = process;
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';
const notEmpty = (a) => a;
const clean = (array) => array.filter(notEmpty);

const rules = clean([
    !isDev && {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!clean-css-loader'
    }, {
        test: /\.(png)$/,
        loader: 'url-loader?limit=50000',
    },
]);

const plugins = [
    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
    new webpack.IgnorePlugin(
        /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
        /vs\/language\/typescript\/lib/
    )
]

module.exports = {
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
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
    plugins,
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://deepword/${resource}`;
}

