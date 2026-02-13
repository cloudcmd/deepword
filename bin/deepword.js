#!/usr/bin/env node

import process from 'node:process';
import fs from 'node:fs';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import info from '../package.json' with {
    type: 'json',
};
import bin from '../json/bin.json' with {
    type: 'json',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const [name] = process.argv.slice(2);

if (!name)
    usage();
else if (/^(-v|--v)$/.test(name))
    version();
else if (/^(-h|--help)$/.test(name))
    help();
else
    checkFile(name, async (error) => {
        if (!error)
            return await main(name);
        
        console.error(error.message);
    });

function getPath(name) {
    const reg = /^[~/]/;
    
    if (!reg.test(name))
        name = process.cwd() + '/' + name;
    
    return name;
}

async function main(name) {
    const filename = getPath(name);
    const DIR = `${__dirname}/../html/`;
    const {deepword} = await import('../server/index.js');
    const {default: express} = await import('express');
    const {Server} = await import('socket.io');
    
    const app = express();
    const server = http.createServer(app);
    
    const {env} = process;
    const port = env.PORT || 1337;
    const ip = env.IP || '0.0.0.0';
    
    app
        .use(express.static(DIR))
        .use(deepword({
        diff: true,
        zip: true,
    }));
    
    server.listen(port, ip);
    
    const socket = new Server(server);
    const edSocket = deepword.listen(socket);
    
    edSocket.on('connection', () => {
        fs.readFile(name, 'utf8', (error, data) => {
            if (error)
                console.error(error.message);
            else
                edSocket.emit('file', filename, data);
        });
    });
    
    console.log('url: http://' + ip + ':' + port);
}

function checkFile(name, callback) {
    fs.stat(name, (error, stat) => {
        let msg;
        
        if (error && error.code === 'ENOENT')
            msg = Error(`no such file or directory: '${name}'`);
        else if (stat.isDirectory())
            msg = Error(`'${name}' is directory`);
        
        callback(msg);
    });
}

function version() {
    console.log(`v${info.version}`);
}

function usage() {
    console.log(`Usage: ${info.name} [filename]`);
}

function help() {
    usage();
    console.log('Options:');
    
    for (const name of Object.keys(bin)) {
        console.log(`  ${name} ${bin[name]}`);
    }
}
