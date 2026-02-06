import {fileURLToPath} from 'node:url';
import path, {dirname} from 'node:path';
import {stat as _stat} from 'node:fs/promises';
import {tryToCatch} from 'try-to-catch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isString = (a) => typeof a === 'string';

export default async (name, {stat = _stat} = {}) => {
    check(name);
    
    const dir = `node_modules/${name}`;
    const [e, inner] = await tryToCatch(resolveModule, [__dirname, '../', dir], stat);
    
    if (!e)
        return inner;
    
    return await resolveModule([__dirname, '../../', name], stat);
};

function check(name) {
    if (!isString(name))
        throw Error('name should be string!');
}

async function resolveModule(dirs, stat) {
    const dir = path.resolve(...dirs);
    
    await stat(dir);
    
    return dir;
}
