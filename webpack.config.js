'use strict';

const path = require('path');
const dir = './client';

const {env} = process;
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';

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
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            util: require.resolve('util'),
        },
    },
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://deepword/${resource}`;
}

