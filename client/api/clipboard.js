'use strict';

const wraptile = require('wraptile/legacy');
const clipboard = require('@cloudcmd/clipboard');
const noop = () => {};

export function copyToClipboard() {
    document.execComand('copy');
    return this;
}

export function cutToClipboard() {
    this.focus();
    document.execComand('cut');
    return this;
}

export function pastFromClipboard() {
    const showMessage = this.showMessage.bind(this);
    
    clipboard.readText()
        .then(paste)
        .catch(wraptile(showMessage, 'past from clipboard no supported in your browser'));
    
    return this;
}

function paste(text) {
    const line = editor.getPosition();
    const range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
    const identifier = {
        major: 1,
        minor: 1,
    };
    
    const op = {
        identifier,
         range,
         text,
         forceMoveMarkers: true,
     };
    
    editor.executeEdits('deepword', [op]);
}

