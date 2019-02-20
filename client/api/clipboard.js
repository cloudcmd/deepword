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
    this.showMessage('pastFromClipboard: Not implemented');
}

