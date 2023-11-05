function validateCssKey(key) {
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

function toCamelCase(value) {
    return value.replace(/-(\w)/g, (matched, letter) => {
        return letter.toUpperCase();
    });
}

function valiateCssValue(key, value) {
    const prefix = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
    const prefixValue = prefix.map(item => {
        return item + value;
    });
    const element = document.createElement('div');
    const eleStyle = element.style;
    prefixValue.forEach(item => {
        eleStyle[key] = item;
    });
    return eleStyle[key];
}

function valiateCssValue(key, value) {
    var prefix = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
    var prefixValue = [];
    for (var i = 0; i < prefix.length; i++) {
        prefixValue.push(prefix[i] + value)
    }
    var element = document.createElement('div');
    var eleStyle = element.style;
    for (var j = 0; j < prefixValue.length; j++) {
        eleStyle[key] = prefixValue[j];
    }
    return eleStyle[key];
}

function validCss(key, value) {
    const valid = validateCssKey(key);
    if (valid) {
        return valid;
    }
    return valiateCssValue(key, value);
}