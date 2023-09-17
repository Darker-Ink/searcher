/**
 * Reverses the keys and values of an object
 */
export const ReverseObject = (obj: Record<string, string>): Record<string, string> => {
    const reversed = Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {} as Record<string, string>);

    return reversed;
}