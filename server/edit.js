import {createRequire} from 'node:module';
import os from 'node:os';
import readjson from 'readjson';
import {tryToCatch} from 'try-to-catch';

const require = createRequire(import.meta.url);
const Edit = require('../json/edit.json');
const HOME = os.homedir();

export default async (req, res, next) => {
    if (req.url !== '/edit.json')
        return next();
    
    const [error, data] = await tryToCatch(readEdit);
    
    if (error)
        return res
            .status(404)
            .send(error.message);
    
    res
        .type('json')
        .send(data);
};

async function readEdit() {
    const homePath = `${HOME}/.deepword.json`;
    const [error, edit] = await tryToCatch(readjson, homePath);
    
    if (!error)
        return {
            ...Edit,
            ...edit,
        };
    
    if (error.code !== 'ENOENT')
        throw Error(`deepword --config ${homePath}: ${error.message}`);
    
    return Edit;
}
