'use strict';

import currify from 'currify/legacy';

const ifDiffDo = currify(_ifDiffDo);
const ifGoodPatch = currify(_ifGoodPatch);
const ifZipDo = currify(_ifZipDo);
const ifNotPatchWrite = currify(_ifNotPatchWrite);
const checkPatch = currify(_checkPatch);

export default function() {
    const doDiff = this._doDiff.bind(this);
    const _patch = this._patch.bind(this);
    const value = this.getValue();
    const {length} = value;
    const {_filename, _maxSize} = this;
    
    const _zip = this._zip.bind(this);
    const _write = this._write.bind(this);
    
    this._loadOptions()
        .then(ifDiffDo(doDiff, _filename))
        .then(checkPatch(length, _maxSize))
        .then(ifGoodPatch(_patch, _filename))
        .then(ifZipDo(_zip, value))
        .then(ifNotPatchWrite(_write, _filename));
    
    return this;
}

function _ifDiffDo(doDiff, value, {diff, zip}) {
    if (!diff)
        return {diff, zip};
    
    return doDiff(value)
        .then((patch) => {
            return {patch, diff, zip}
        });
}

function _checkPatch(length, maxSize, {diff, zip, patch}) {
    if (!diff)
        return {zip};
    
    const patchLength = patch && patch.length || 0;
    const isLessMaxLength = length < maxSize;
    const isLessLength = isLessMaxLength && patchLength < length;
    const isStr = typeof patch === 'string';
    const isPatch = patch && isStr && isLessLength;
    
    return {zip, patch, isPatch};
}

function _ifGoodPatch(patchFn, filename, {patch, zip, isPatch}) {
    if (!isPatch)
        return {zip}
    
    return patchFn(filename, patch).then(() => {
        return {isPatch};
    });
}

function _ifZipDo(zipFn, value, {zip, isPatch}) {
    if (isPatch)
        return {isPatch};
    
    if (!zip)
        return {value};
    
    return zipFn(value)
        .then((value) => {
            return {zip, value}
        });
}

function _ifNotPatchWrite(write, filename, {isPatch, zip, value}) {
    if (isPatch)
        return;
    
    const uri = !zip ? filename : filename + '?unzip';
    
    return write(uri, value);
}

