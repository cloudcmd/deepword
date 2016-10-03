'use strict';

import Story from './story';

/*
const story = Story();

story.loadHash((a) => {
    console.log(a);
});
*/

export default function DeepWord(el) {
    require.config({ paths: { 'vs': '/deepword/node_modules/monaco-editor/min/vs' }});
    
    require(['vs/editor/editor.main'], () => {
        const editor = monaco.editor.create(element(el), {
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\n'),
            language: 'javascript',
            scrollBeyondLastLine: false
        });
    });
}

function element(el) {
    if (typeof el === 'string')
        return document.querySelector(element);
   
   return el;
}
