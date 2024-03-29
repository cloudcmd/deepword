import wraptile from 'wraptile';
import {promisify} from 'es6-promisify';
import _zipio from 'zipio';

const isString = (a) => typeof a === 'string';
const zipio = promisify(_zipio);

const setValue = wraptile(_setValue);

export default function() {
    save
        .call(this)
        .then(setValue(this));
    
    return this;
}

async function save() {
    const value = this.getValue();
    const {length} = value;
    const {_filename, _maxSize} = this;
    
    const {diff, zip} = await this._loadOptions();
    
    if (diff) {
        const patch = await this._doDiff(_filename);
        const isPatch = checkPatch(length, _maxSize, patch);
        
        if (isPatch)
            return this._patch(_filename, patch);
    }
    
    if (!zip)
        return this._write(_filename, value);
    
    const zipedValue = await zipio(value);
    
    return this._write(`${_filename}?unzip`, zipedValue);
}

function _setValue(ctx) {
    ctx._value = ctx.getValue();
}

function checkPatch(length, maxSize, patch) {
    const patchLength = patch?.length || 0;
    const isLessMaxLength = length < maxSize;
    const isLessLength = isLessMaxLength && patchLength < length;
    const isStr = isString(patch);
    
    return patch && isStr && isLessLength;
}
