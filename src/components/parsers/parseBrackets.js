const bracketPatterns = ["attr", "var", "counter", "url", "image", "element", "toggle", "repeat", "lang", "target-counter", "target-text", "linear-gradient", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient", "conic-gradient", "calc", "min", "max", "clamp", "rgb", "rgba", "hsl", "hsla", "hsv", "hsva", "lab", "lch", "gray", "matrix", "matrix3d", "perspective", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "translate", "translate3d", "translateX", "translateY", "translateZ", "blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "invert", "opacity", "sepia", "saturate"];

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

export default function parseBrackets(str, deep = false) {
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