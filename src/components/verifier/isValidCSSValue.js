export default function isValidCSSValue(key, value) {
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
