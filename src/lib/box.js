import { diff, clean, parseHTML } from "../test.js";

var boxModel = {};

function map(arr, func) {
    var len = arr.length;
    var res = new Array(len);

    for (let i = 0; i < len; i++) {
        res[i] = func(arr[i])
    }

    return res;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

boxModel.getData = function (element) {
    const computedStyle = window.getComputedStyle(element);

    function getBoxModelValue(type) {
        let keys = ['top', 'left', 'right', 'bottom']
        if (type !== 'position') {
            keys = map(keys, (key) => `${type}-${key}`)
        }
        if (type === 'border') {
            keys = map(keys, (key) => `${key}-width`)
        }

        return {
            top: convertToBoxModelValue(computedStyle[keys[0]], type),
            left: convertToBoxModelValue(computedStyle[keys[1]], type),
            right: convertToBoxModelValue(computedStyle[keys[2]], type),
            bottom: convertToBoxModelValue(computedStyle[keys[3]], type),
        }
    }

    const boxModel = {
        margin: getBoxModelValue('margin'),
        border: getBoxModelValue('border'),
        padding: getBoxModelValue('padding'),
        content: {
            width: convertToBoxModelValue(computedStyle['width']),
            height: convertToBoxModelValue(computedStyle['height']),
        },
    }

    if (computedStyle['position'] !== 'static') {
        boxModel.position = getBoxModelValue('position')
    }

    return boxModel;
}

function convertToBoxModelValue(val, type) {
    if (Number.isInteger(val)) {
        return val;
    }
    var ret = +val.replace("px", "");
    ret = isNaN(ret) ? "position" === type ? "‒" : val : "position" === type ? ret : 0 == ret ? "content" == type ? 0 : "‒" : ret;
    if (isFloat(ret)) {
        return ret.toFixed(3);
    }
    return ret;
}

/*

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

function toNumber(val) {
    if (isNumber(val)) return val;

    if (isObject(val)) {
        const temp = isFunction(val.valueOf) ? val.valueOf() : val;
        val = isObject(temp) ? temp + '' : temp;
    }

    if (!isString(val)) return val === 0 ? val : +val;

    return +val;
};

function pxToNumber(str) {
    return toNumber(str.replace('px', ''));
}

*/

/*
class Emmet {
    constructor(selector, content) {
        var selectors = this.selectorParser(selector);
        var element = document.createElement(selectors.tags[selectors.tags.length - 1] || 'div');
        selectors.classes.forEach(className => {
            element.classList.add(className);
        })
        selectors.attrs.forEach(attr => {
            element.setAttribute(attr[0], attr[1]);
        })
        selectors.ids.forEach(id => {
            element.id = id;
        })
        if (content) {
            element.innerHTML = content;
        }
        return element;
    }

    selectorParser(subselector) {
        var obj = { tags: [], classes: [], ids: [], attrs: [] };
        subselector.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function (token) {
            switch (token[0]) {
                case '#':
                    obj.ids.push(token.slice(1));
                    break;
                case '.':
                    obj.classes.push(token.slice(1));
                    break;
                case '[':
                    obj.attrs.push(token.slice(1, -1).split('='));
                    break;
                default:
                    obj.tags.push(token);
                    break;
            }
        });
        return obj;
    }
}
*/

boxModel.CMgr = (name) => {
    var classNames = {
        'label': 'box-label',
        'left': 'box-left',
        'top': 'box-top',
        'right': 'box-right',
        'bottom': 'box-bottom',
        'position': 'box-position',
        'margin': 'box-margin',
        'border': 'box-border',
        'padding': 'box-padding',
        'content': 'box-content'
    }
    if (classNames[name]) {
        return classNames[name];
    }
}

boxModel.render = function (target, boxModelData, returnType = 'append') {
    var boxModelHTML = `<div class='box'>
        ${boxModelData.position ? `<div class="${boxModel.CMgr('position')}"><div class="${boxModel.CMgr('label')}">position</div><div class="${boxModel.CMgr('top')}">${boxModelData.position.top}</div><br><div class="${boxModel.CMgr('left')}">${boxModelData.position.left}</div>` : ''}
        <div class="${boxModel.CMgr('margin')}">
            <div class="${boxModel.CMgr('label')}">margin</div><div class="${boxModel.CMgr('top')}">${boxModelData.margin.top}</div><br><div class="${boxModel.CMgr('left')}">${boxModelData.margin.left}</div>
            <div class="${boxModel.CMgr('border')}">
                <div class="${boxModel.CMgr('label')}">border</div><div class="${boxModel.CMgr('top')}">${boxModelData.border.top}</div><br><div class="${boxModel.CMgr('left')}">${boxModelData.border.left}</div>
                <div class="${boxModel.CMgr('padding')}">
                    <div class="${boxModel.CMgr('label')}">padding</div><div class="${boxModel.CMgr('top')}">${boxModelData.padding.top}</div><br><div class="${boxModel.CMgr('left')}">${boxModelData.padding.left}</div>
                    <div class="${boxModel.CMgr('content')}">
                        <span>${boxModelData.content.width}</span>&nbsp;×&nbsp;<span>${boxModelData.content.height}</span>
                    </div>
                <div class="${boxModel.CMgr('right')}">${boxModelData.padding.right}</div><br><div class="${boxModel.CMgr('bottom')}">${boxModelData.padding.bottom}</div>
            </div>
            <div class="${boxModel.CMgr('right')}">${boxModelData.border.right}</div><br><div class="${boxModel.CMgr('bottom')}">${boxModelData.border.bottom}</div>
            </div>
        <div class="${boxModel.CMgr('right')}">${boxModelData.margin.right}</div><br><div class="${boxModel.CMgr('bottom')}">${boxModelData.margin.bottom}</div>
        </div>
        ${boxModelData.position ? `<div class="${boxModel.CMgr('right')}">${boxModelData.position.right}</div><br><div class="${boxModel.CMgr('bottom')}">${boxModelData.position.bottom}</div></div>` : ''}
    </div>`;

    if (returnType == 'html' || returnType == 'string') {
        return boxModelHTML;
    }
    
    var boxModelContentVDOM = parseHTML(boxModelHTML);

    clean(target);
    diff(boxModelContentVDOM, target);
}

export default boxModel;