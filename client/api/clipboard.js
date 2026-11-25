export function copyToClipboard() {
    document.execCommand('copy');
    return this;
}

export function cutToClipboard() {
    this.focus();
    document.execCommand('cut');
    
    return this;
}

export function pastFromClipboard() {
    this.showMessage('pastFromClipboard: Not implemented');
}
