'use strict';

const DIR_ROOT = __dirname + '/..';
const path = require('path');

const restafary = require('restafary');
const socketFile = require('socket-file');
const express = require('express');
const currify = require('currify/legacy');
const storage = require('fullstore/legacy');

const resolvePath = require('./resolve-path');

const Router = express.Router;

const rootStorage = storage();
const optionsStorage = storage();

const optionsFn = currify(configFn);
const restafaryFn = currify(_restafaryFn);

const isDev = process.env.NODE_ENV === 'development';

module.exports = (options) => {
    options = options || {};
    optionsStorage(options);
    
    const router = Router();
    const prefix = options.prefix || '/deepword';
    
    router.route(prefix + '/*')
        .get(deepword(options))
        .get(optionsFn(options))
        .get(restafaryFn(''))
        .get(monaco)
        .get(staticFn)
        .put(restafaryFn(prefix));
    
    return router;
};

module.exports.listen = (socket, options) => {
    options = options || {};
    
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
    
    const regExp = /^\/deepword\.js(\.map)?$/;
    
    if (regExp.test(req.url))
        req.url = '/dist' + req.url;
    
    if (isDev)
        req.url = req.url.replace(/^\/dist\//, '/dist-dev/');
    
    next();
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

function _restafaryFn(prefix, req, res, next) {
    const url = req.url;
    const api = '/api/v1/fs';
    
    if (url.indexOf(prefix + api))
        return next();
    
    req.url = url.replace(prefix, '');
    
    const restafaryFunc = restafary({
        prefix: api,
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

function staticFn(req, res) {
    const file = path.normalize(DIR_ROOT + req.url);
    res.sendFile(file);
}

