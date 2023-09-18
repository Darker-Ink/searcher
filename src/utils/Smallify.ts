/**
 * Takes the largest keys and values and moves them to the end of the object.
 */
const Smallify = (obj: Record<string, string>) => {
    const newObj: Record<string, string> = {};
    const keys = Object.keys(obj);
    
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        
        if (key.length > 100 || value.length > 100) {
            newObj[key] = value;
            delete obj[key];
        }
    }

    return Object.assign(obj, newObj);
}

export default Smallify;