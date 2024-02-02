import './show-message.css';

export default function showMessage(text) {
    const HIDE_TIME = 2000;
    let {_elementMsg} = this;
    
    if (!_elementMsg) {
        this._elementMsg = _elementMsg = createMsg();
        this._element.appendChild(this._elementMsg);
    }
    
    _elementMsg.textContent = text;
    _elementMsg.hidden = false;
    
    setTimeout(() => {
        _elementMsg.hidden = true;
    }, HIDE_TIME);
    
    return this;
}

function createMsg() {
    const wrapper = document.createElement('div');
    
    wrapper.innerHTML = '<div class="deepword-msg">/div>';
    
    return wrapper.firstChild;
}
