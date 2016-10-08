'use strict';

export default (srcs, callback) => {
    const func = () => {
        --i;
        
        if (!i)
            callback();
    };
    
    if (typeof srcs === 'string')
        srcs = [srcs];
    
    let i = srcs.length;
    
    srcs.forEach((src) => {
        const element = document.createElement('script');
    
        element.src = src;
        element.addEventListener('load', function load() {
            func();
            element.removeEventListener('load', load);
        });
    
        document.body.appendChild(element);
    });
}

