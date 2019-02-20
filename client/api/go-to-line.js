import {prompt} from 'smalltalk';

export default function goToLine() {
    const empty = (e) => {
        if (e)
            throw e;
    };
    const msg = 'Enter line number:';
    const {_eddy, _TITLE} = this;
    const {lineNumber} = _eddy.getPosition();
    
    prompt(_TITLE, msg, lineNumber)
        .then((line) => {
            const lineNumber = Number(line);
            const column = 0;
            
            const reveal = true;
            const revealVerticalInCenter = true;
            
            _eddy.setPosition({
                lineNumber,
                column
            }, reveal, revealVerticalInCenter);
        })
        .catch(empty)
        .then(() => {
            _eddy.focus();
        });
    
    return this;
}

