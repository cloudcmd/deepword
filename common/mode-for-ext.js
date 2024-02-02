import currify from 'currify';

const isString = (a) => typeof a === 'string';

const byExtension = currify((ext, options) => {
    const {extensions} = options;
    return extensions?.includes(ext);
});

export default (ext, langs) => {
    check(ext, langs);
    
    const empty = {
        id: '',
    };
    
    const mode = langs
        .filter(byExtension(ext))
        .pop();
    
    return (mode || empty).id;
};

function check(ext, langs) {
    if (!isString(ext))
        throw Error('ext should be string!');
    
    if (!Array.isArray(langs))
        throw Error('langs should be an array!');
}
