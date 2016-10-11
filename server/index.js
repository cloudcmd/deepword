'use strict';

const DIR_ROOT = __dirname + '/..';
const path = require('path');

const Promise = require('promise-polyfill');
const join = require('join-io');
const mollify = require('mollify');
const restafary = require('restafary');
const socketFile = require('socket-file');
const express = require('express');
const currify = require('currify');

const storage = require('./storage');
const resolvePath = require('./resolve-path');

const Router = express.Router;

const rootStorage = storage();
const optionsStorage = storage();

const minifyFunc = mollify({
    dir : DIR_ROOT
});

const optionsFn = currify(configFn);

module.exports = (options = {}) => {
    optionsStorage(options);
    
    const router = Router();
    const prefix = options.prefix || '/deepword';
    
    router.route(prefix + '/*')
        .get(deepword(options))
        .get(joinFn)
        .get(optionsFn(options))
        .put(restafaryFn)
        .get(monaco)
        .get(minifyFn)
        .get(staticFn);
    
    return router;
};

module.exports.listen = (socket, options = {}) => {
    if (!options.prefix)
        options.prefix = '/deepword';
    
    if (!options.root)
        options.root = '/';
    
    rootStorage(options.root);
    
    return socketFile(socket, options);
};

function checkOption(isOption) {
    if (typeof isOption === 'function')
        return isOption();
    
    if (typeof isOption === 'undefined')
        return true;
    
    return isOption;
}

function deepword(options) {
    return serve.bind(null, options);
}

function serve(options, req, res, next) {
    const o = options || {};
    const prefix = o.prefix || '/deepword';
    const url = req.url
    
    if (url.indexOf(prefix))
        return next();
    
    req.url = req.url.replace(prefix, '');
    
    const regExp = /^\/deepword\.(js(\.map)?|css)$/;
    
    if (regExp.test(req.url))
        req.url = '/dist' + req.url;
    
    next();
}

function joinFn(req, res, next) {
    const url = req.url;
    
    if (url.indexOf('/join'))
        return next();
    
    const options = optionsStorage();
    const minify = checkOption(options.minify);
    
    const joinFunc = join({
        minify,
        dir: DIR_ROOT,
    });
    
    joinFunc(req, res, next);
}

function configFn(o, req, res, next) {
    const online = checkOption(o.online);
    const diff = checkOption(o.diff);
    const zip = checkOption(o.zip);
    
    if (req.url.indexOf('/options.json'))
        return next();
    
    res .type('json')
        .send({
            diff,
            zip,
            online,
        });
}

function restafaryFn(req, res, next) {
    const isRestafary = [
        '/api/v1/fs',
        '/restafary.js'
    ].some((item) => {
        return !req.url.indexOf(item);
    });
    
    if (!isRestafary)
        return next();
    
    const restafaryFunc = restafary({
        prefix: '/api/v1/fs',
        root: rootStorage()
    });
    
    restafaryFunc(req, res, next);
}

function monaco(req, res, next) {
    if (req.url.indexOf('/monaco'))
        return next();
    
    const sendFile = res.sendFile.bind(res);
    
    const replace = (path) => {
        return req.url.replace('/monaco', path);
    };
    
    const sendError = (error) => {
        res.status(404).send(error);
    };
    
    resolvePath('monaco-editor')
        .then(replace)
        .then(sendFile)
        .catch(sendError);
}

function minifyFn(req, res, next) {
    const options = optionsStorage();
    const minify = checkOption(options.minify);
    
    if (!minify)
        return next();
    
    return minifyFunc(req, res, (req, res) => {
        staticFn(req, res);
    });
}

function staticFn(req, res) {
    const file = path.normalize(DIR_ROOT + req.url);
    res.sendFile(file);
}

