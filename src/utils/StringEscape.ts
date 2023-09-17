/**
 * Escapes stuff in a string so it can be made into a regex
 */
export const EscapeString = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};