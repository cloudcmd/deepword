'use strict';

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
    /*eslint no-console: ["error", { allow: ["log"] }] */
    console.log('pastFromClipboard: Not implemented');
}
