'use strict';

const path = require('path');
const webpack = require('webpack');

const {env} = process;
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');

module.exports = {
    entry: {
        // Package each language's worker and give these filenames in `getWorkerUrl`
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
        'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
        'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
    },
    output: {
        filename: '[name].bundle.js',
        path: !isDev ? dist : distDev,
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }]
    },
    plugins: [
        // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
        new webpack.IgnorePlugin(
            /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
            /vs\/language\/typescript\/lib/
        )
    ]
};

