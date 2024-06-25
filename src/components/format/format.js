import isElement from "../verifier/isElement";
import { colorCodeRegex } from "../regex/regex.js";

const colorNames = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgray", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "transparent"];

const bracketPatterns = ["attr", "var", "counter", "url", "image", "element", "toggle", "repeat", "lang", "target-counter", "target-text", "linear-gradient", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "conic-gradient", "calc", "min", "max", "clamp", "rgb", "rgba", "hsl", "hsla", "hsv", "hsva", "lab", "lch", "gray", "matrix", "matrix3d", "perspective", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "translate", "translate3d", "translateX", "translateY", "translateZ", "blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "invert", "opacity", "sepia", "saturate"];

function styleURLTextFormat(org) {
    if (org.length <= 21) return org;
    return org.slice(0, 11) + "…" + org.slice(-9)
}

function valueURLFormat(value, link = false) {
    if (link == true) {
        if (value.length <= 100) return value;
        return value.slice(0, 50) + "…" + value.slice(-49);
    }
    value = value.replace(/\".+\"/gi, (match, p1) => {
        return match.replace(/\"?\"/gi, '');
    });
    if (value.length <= 100) return `<a href="${value.toString()}" target="_blank" class="style-value-url-link" data-tippy-content="${value}">${value}</a>`;
    return `<a href="${value.toString()}" target="_blank" class="style-value-url-link" data-tippy-content="${value}">${value.slice(0, 50) + "…" + value.slice(-49)}</a>`;
}

function styleURLFormat(ownerNode) {
    if (isElement(ownerNode) == true) {
        var origin = ownerNode.getAttribute("href") ? styleURLTextFormat(ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1)) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`;
        return `<${ownerNode.getAttribute("href") ? "a target='_blank' href='" + ownerNode.getAttribute("href") + "'" : "span"} style='color: ${ownerNode.getAttribute("href") ? "auto" : "rgb(175 170 170)"};float: right;margin-left: 15px;text-wrap: nowrap;height: 15px;margin-bottom: -1px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;direction: rtl;text-align: left;'>${origin}</${ownerNode.getAttribute("href") ? "a" : "span"}>`;
    } else {
        return '';
    }

}

function selectorFormat(selector, element) {
    var selectors = selector.split(",");
    var res = [];
    selectors.forEach((s, i) => {
        s = s.trim();
        if (element.matches(s)) {
            res.push(s)
        } else {
            res.push("<span style='color: rgb(175 170 170);'>" + s + "</span>");
        }
    })
    return res.join("<span style='color: rgb(175 170 170);'>, </span>");
}

class Stack {
    constructor() {
        this.items = [];
    }

    // add element to the stack
    push(element) {
        return this.items.push(element);
    }

    // remove element from the stack
    pop() {
        if (this.items.length > 0) {
            return this.items.pop();
        }
    }

    // view the last element
    top() {
        return this.items[this.items.length - 1];
    }

    // check if the stack is empty
    isEmpty() {
        return this.items.length == 0;
    }

    // the size of the stack
    size() {
        return this.items.length;
    }

    // empty the stack
    clear() {
        this.items = [];
    }
}

// Function to find index of closing
// bracket for given opening bracket.
function getBracketsRange(expression, index) {
    var i;

    // If index given is invalid and is
    // not an opening bracket.
    if (expression[index] != "(") {
        console.log(expression + ", " + index + ": -1");
        return;
    }

    // Stack to store opening brackets.
    let st = new Stack();
    //stack <int> st;

    // Traverse through string starting from
    // given index.
    for (i = index; i < expression.length; i++) {
        // If current character is an
        // opening bracket push it in stack.
        if (expression[i] == "(") st.push(expression[i]);
        // If current character is a closing
        // bracket, pop from stack. If stack
        // is empty, then this closing
        // bracket is required bracket.
        else if (expression[i] == ")") {
            st.pop();
            if (st.isEmpty()) {
                // console.log(expression + ", " + index + ": " + i);
                return i;
            }
        }
    }

    // If no matching closing bracket
    // is found.
    // console.log(expression + ", " + index + ": -1");
    return -1;
}

function getAllCSSComponentsWithBrackets(str, deep = false) {
    var brackets = {};

    str.matchAll(/\(/g).forEach((matched) => {
        // console.log(str.slice(matched.index, getBracketsRange(str, matched.index) + 1));
        var beforeIndexString = str.slice(0, matched.index);

        var reverseString = [...beforeIndexString].reverse().join("");

        var matches = reverseString.matchAll(/[0-9A-z-]*/g);

        brackets[matched.index] = {
            end: getBracketsRange(str, matched.index) + 1,
            pattern: ''
        };
        // console.log(firstMatch.index, firstMatch.length)
        matches.forEach(match => {
            if (match.index == 0) {
                var reverseFirstMatch = [...match[0]].reverse().join("");
                if (bracketPatterns.includes(reverseFirstMatch)) {
                    brackets[matched.index].pattern = reverseFirstMatch;
                }
            }
            return;
        })

        Object.keys(brackets).forEach((startIndex, i) => {
            if (startIndex > matched.index && getBracketsRange(str, matched.index) + 1 > startIndex) {
                delete brackets[startIndex];
                brackets[matched.index] = {
                    end: getBracketsRange(str, matched.index) + 1,
                    pattern: ''
                };
                matches.forEach(match => {
                    if (match.index == 0) {
                        var reverseFirstMatch = [...match[0]].reverse().join("");
                        if (bracketPatterns.includes(reverseFirstMatch)) {
                            brackets[matched.index].pattern = reverseFirstMatch;
                        }
                    }
                    return;
                })
            } else if (startIndex < matched.index && getBracketsRange(str, matched.index) + 1 < Object.values(brackets)[i].end && deep == false) {
                delete brackets[matched.index];
            }
        })

        // console.log(beforeIndexString, str.slice(matched.index, getBracketsRange(str, matched.index) + 1))
    })

    /*
    if (Object.keys(brackets).length > 0) {
        console.log(brackets);
        Object.keys(brackets).forEach((start, i) => {
            console.log('%c ' + Object.values(brackets)[i].pattern + str.slice(start, Object.values(brackets)[i].end), 'color: #6cff8a', `[${start}, ${Object.values(brackets)[i].end}]`);
        })
    }
    */

    return brackets;
}

function replaceCSSVars(str, element) {
    function varIsColor(str) {
        if (colorCodeRegex.test(str) == true) {
            if (str.trim().startsWith('#') || str.trim().startsWith('rgb') || str.trim().startsWith('hsl')) {
                return true;
            } else {
                return false;
            }
        }
        if (colorNames.includes(str.toLowerCase())) return true;
        return false;
    }

    return str.replaceAll(/var\((--.*?)\)/g, (match, p1) => {
        // console.log(`Match: ${match},\n P1: ${p1}`)
        var defined = getComputedStyle(element).getPropertyValue(p1) !== '';
        if (defined == false) {
            return `var(<span class="undefined-variable">${p1}</span>)`;
        } else if (varIsColor(getComputedStyle(element).getPropertyValue(p1)) == true) {
            return `<span class='_css_editor_info_stylesheets_content_styles_color defined-variable'><span style="background: ${getComputedStyle(element).getPropertyValue(p1)}" class='_css_editor_info_stylesheets_content_styles_color_content defined-variable'></span></span>var(<span class="defined-variable" data-tippy-content="${getComputedStyle(element).getPropertyValue(p1)}">${p1}</span>)`;
        } else {
            return `var(<span class="defined-variable" data-tippy-content="${getComputedStyle(element).getPropertyValue(p1)}">${p1}</span>)`;
        }
    });
}

function Color_regex(str, element) {
    var matches = str.replaceAll(colorCodeRegex, match => {
        if (colorNames.includes(match.toLowerCase()) || match.indexOf('#') > -1 || match.indexOf('rgb') > -1 || match.indexOf('hsl') > -1) {
            return `<span><span class='_css_editor_info_stylesheets_content_styles_color'><span style="background: ${match}" class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}</span>`;
        } else {
            return match;
        }
    });

    matches = replaceCSSVars(matches, element);

    /*
    matches = matches.replaceAll(color_text_regex, match => {
        return `<span><span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${match}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}</span>`;
    })
    */

    return matches ? matches : str;
}

function toCamelCase(value) {
    return value.replace(/-(\w)/g, (matched, letter) => {
        return letter.toUpperCase();
    });
}

function removeHTMLTag(content) {
    return content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export {
    styleURLFormat, valueURLFormat, styleURLTextFormat, selectorFormat, replaceCSSVars, Color_regex, toCamelCase, removeHTMLTag, getAllCSSComponentsWithBrackets
}