#!/usr/bin/env node

'use strict';

const fs = require('fs');
const rendy = require('rendy');
const args = process.argv.slice(2);
const [arg] = args;
    
if (!arg)
    usage();
else if (/^(-v|--v)$/.test(arg))
    version();
else if (/^(-h|--help)$/.test(arg))
    help();
else
    checkFile(arg, (error) => {
        if (!error)
            main(arg);
        else
            console.error(error.message);
    });

function getPath(name) {
    const reg = /^(~|\/)/;
    
    if (!reg.test(name))
        name = process.cwd() + '/' + name;
    
    return name;
}

function main(name) {
    const filename = getPath(name);
    const DIR = __dirname + '/../dist/';
    const dword = require('..');
    const http = require('http');
    const express = require('express');
    const io = require('socket.io');
    
    const app = express();
    const server = http.createServer(app);
    
    const env = process.env;
    
    const port =    env.PORT            ||  /* c9           */
                    env.app_port        ||  /* nodester     */
                    env.VCAP_APP_PORT   ||  /* cloudfoundry */
                    1337;
    const ip =  env.IP                  ||  /* c9           */
                '0.0.0.0';
    
    app .use(express.static(DIR))
        .use(dword({
            minify: false,
            online: false
        }));
    
    server.listen(port, ip);
    
    const socket = io.listen(server);
    const edSocket = dword.listen(socket);
    
    edSocket.on('connection', function() {
        fs.readFile(name, 'utf8', function(error, data) {
            if (error)
                console.error(error.message);
            else
                edSocket.emit('file', filename, data);
        });
    });
    
    console.log('url: http://' + ip + ':' + port);
}

function checkFile(name, callback) {
    const ERROR_ENOENT = 'Error: no such file or directory: \'{{ name }}\'';
    const ERROR_ISDIR = 'Error: \'{{ name }}\' is directory';
    
    fs.stat(name, function(error, stat) {
        let msg;
        
        if (error && error.code === 'ENOENT')
            msg = ERROR_ENOENT;
        else if (stat.isDirectory())
            msg = ERROR_ISDIR;
            
        if (msg)
            error = {
                message: rendy(msg, {
                    name: arg
                })
            };
        
        callback(error);
    });
}

function version() {
    console.log(`v${info().version}`);
}

function info() {
    return require('../package');
}

function usage() {
    console.log(`Usage: ${info().name} [filename]`);
}

function help() {
    const bin = require('../json/bin');
        
    usage();
    console.log('Options:');
    
    Object.keys(bin).forEach((name) => {
        console.log(`  ${name} ${bin[name]}`);
    });
}
