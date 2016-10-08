'use strict';

const DIR_ROOT = __dirname + '/..';
const path = require('path');

const join = require('join-io');
const mollify = require('mollify');
const restafary = require('restafary');
const socketFile = require('socket-file');
const express = require('express');

const storage = require('./storage');

const {Router} = express;

const rootStorage = storage();
const optionsStorage = storage();

const minifyFunc = mollify({
    dir : DIR_ROOT
});

module.exports = (options = {}) => {
    optionsStorage(options);
    
    const router = Router();
    
    router.route(options.prefix || '/deepword/*')
        .get(deepword(options))
        .get(joinFn)
        .get(configFn)
        .get(restafaryFn)
        .put(restafaryFn)
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
    optionsStorage(options);
    
    return socketFile(socket, options);
};

function checkOption(isOption) {
    if (isOption === 'function')
        return isOption();
    
    if (isOption === 'undefined')
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
    const isMin = checkOption(options.isMin);
    
    const joinFunc = join({
        dir     : DIR_ROOT,
        minify  : isMin
    });
    
    joinFunc(req, res, next);
}

function configFn(options, req, res, next) {
    const o = optionsStorage();
    const isOnline    = checkOption(o.online);
    const isDiff      = checkOption(o.diff);
    const isZip       = checkOption(o.pack);
    
    if (url.indexOf('/config.json'))
        return next();
    
    res .type('json')
        .send({
            diff: isDiff,
            zip: isZip,
            online: isOnline
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

function minifyFn(req, res, next) {
    const options = optionsStorage();
    const isMin = checkOption(options.isMin);
    
    if (!isMin)
        return next();
    
    return minifyFunc(req, res, (req, res) => {
        staticFn(req, res);
    });
}

function staticFn(req, res) {
    const file = path.normalize(DIR_ROOT + req.url);
    res.sendFile(file);
}

