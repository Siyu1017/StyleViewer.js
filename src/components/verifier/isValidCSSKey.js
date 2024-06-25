import { toCamelCase } from "../format/format";

export default function isValidCSSKey(key) {
    const jsKey = toCamelCase(key);
    if (jsKey in document.documentElement.style) {
        return key;
    }
    let validKey = '';
    const prefixMap = {
        Webkit: '-webkit-',
        Moz: '-moz-',
        ms: '-ms-',
        O: '-o-'
    };
    for (const jsPrefix in prefixMap) {
        const styleKey = toCamelCase(`${jsPrefix}-${jsKey}`);
        if (styleKey in document.documentElement.style) {
            validKey = prefixMap[jsPrefix] + key;
            break;
        }
    }
    return validKey;
}