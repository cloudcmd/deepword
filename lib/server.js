'use strict';

const DIR_ROOT = __dirname + '/..';
const path = require('path');
const join = require('join-io');
const mollify = require('mollify');
const restafary = require('restafary');
const socketFile = require('socket-file');
const readjson = require('readjson');
const HOME = require('os-homedir')();
const express = require('express');

const {Router} = express;

const rootStorage = storage();
const optionsStorage = storage();

const minifyFunc = mollify({
    dir : DIR_ROOT
});

module.exports = (options) => {
    optionsStorage(options);
    
    const router = Router()
        .use(joinFn)
        .use(configFn)
        .use(restafaryFn)
        .use(staticFn);
    
    return () => serve(router, options);
};

module.exports.listen = (socket, options = {}) => {
    let ret;
    
    if (!options.prefix)
        options.prefix = '/deepword';
    
    if (!options.root)
        options.root = '/';
    
    rootStorage(options.root);
    optionsStorage(options);
    ret = socketFile(socket, options);
    
    return ret;
};

function checkOption(isOption) {
    const type = typeof isOption;
    
    if (isOption === 'function')
        return isOption();
    
    if (isOption === 'undefined')
        return true;
    
    return isOption;
}

function copy(from) {
    return Object
        .keys(from)
        .reduce((value, name) => {
            value[name] = from[name];
            return value;
        }, {});
}

function replace(from, to) {
    Object.keys(from).forEach((name) => {
        to[name] = from[name];
    });
}

function serve(options, router, req, res, next) {
    const o = options || {};
    const prefix = o.prefix || '/deepword';
    const url = req.url
    
    if (url.indexOf(prefix))
        return next();
    
    url = url.replace(prefix, '');
    
    const URL         = '/deepword.js';
    const MODULES     = '/modules.json';
    const PATH        = '/lib/client.js';
    
    switch(url) {
    case URL:
        url = PATH;
        break;
    
    case MODULES:
        url = '/json' + url;
        break;
    }
        
    req.url = url;
    
    router(req, res, next);
}

function joinFn(req, res, next) {
    const url = req.url;
    
    if (url.indexOf('/join'))
        return next();
    
    const options = optionsStorage();
    const isMin = checkOption(options.isMin);
    
    joinFunc = join({
        dir     : DIR_ROOT,
        minify  : isMin
    });
    
    joinFunc(req, res, next);
}

function configFn(options, req, res, next) {
    const CONFIG = '/options.json';
    const o = optionsStorage();
    const isOnline    = checkOption(o.online);
    const isDiff      = checkOption(o.diff);
    const isZip       = checkOption(o.pack);
    
    if (url !== CONFIG)
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
        return !url.indexOf(item);
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
    const isMin = checkOption(option.isMin);
    return minifyFunc(req, res, () => {
        staticFn(req, res);
    });
}

function staticFn(req, res) {
    const url = path.normalize(DIR_ROOT + req.url);
    res.sendFile(url);
}

function storage() {
    let value;
    return (data) => {
        if (data)
            value = data;
        else
            return value;
    };
}
