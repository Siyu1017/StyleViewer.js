/**
 * Code by Siyu1017 (c) 2023 - 2024
 * All rights reserved.
 * StyleViewer.js
 */

"use strict";

import tippy from 'tippy.js';
import "tippy.js/dist/tippy.css";

import "./StyleViewer.css";
import boxModel from './lib/box.js';
import "./lib/box.css";
import ElementStyle from "./components/css/elementstyle.js";
import StyleSheets from "./components/css/stylesheets.js";
import isValidCSSKey from "./components/verifier/isValidCSSKey.js";
import isValidCSSValue from "./components/verifier/isValidCSSValue.js";
import isElement from "./components/verifier/isElement";
import removeHTMLTag from './components/formatters/removeHTMLTag.js';
import parseBrackets from './components/parsers/parseBrackets.js';
import formatStyleURL from './components/formatters/formatStyleURL.js';
import generateColorBlock from './components/formatters/generateColorBlock.js';
import formatSelector from './components/formatters/formatSelector.js';
import formatLongURL from './components/formatters/formatLongURL.js';

import { diff, clean, parseHTML } from "./test.js";

import pkg from "../package.json";

(() => {
    var $ = (s, a) => {
        return a == true ? document.querySelectorAll(s) : document.querySelector(s);
    };
    var initial = false;
    const hash = {
        highlight: Hash(24, "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-_abcdefghijklmnopqrstuvwxyz"),
        popup: Hash(24, "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPasdfghj2644200123456789"),
    }

    const StyleViewer = {
        selecting: false,
        filters: ["StyleViewer", []],
        version: pkg.version
    };

    function Hash(n, c) { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };

    function Element(tagName, classList, attributes, target) {
        var element = document.createElement(tagName);
        typeof classList === "array" ? classList.forEach(c => {
            element.classList.add(c);
        }) : typeof classList === "string" ? classList.split(" ").forEach(c => {
            element.classList.add(c);
        }) : null;
        typeof attributes === "array" ? attributes.forEach(a => {
            element.setAttribute(a[0], a[1]);
        }) : null;
        return target.appendChild(element);
    }

    function getPosition(element) {
        function offset(el) {
            var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }
        return { x: offset(element).left, y: offset(element).top };
    }

    var hlel = {
        padding: {},
        border: {},
        margin: {}
    }

    function highlightElement(element) {
        var position = element.nodeName.toLowerCase() == "path" ? {
            x: element.getClientRects()[0].left,
            y: element.getClientRects()[0].top
        } : getPosition(element);
        var size = {
            width: element.getClientRects()[0].width,
            height: element.getClientRects()[0].height
        }
        var hlcolors = {
            content: 'rgba(111, 168, 220, .66)',
            padding: 'rgba(147, 196, 125, .55)',
            border: 'rgba(255, 229, 153, .66)',
            margin: 'rgba(246, 178, 107, .66)'
        }

        StyleViewer.highlightElement.style.width = size.width + "px";
        StyleViewer.highlightElement.style.height = size.height + "px";
        StyleViewer.highlightElement.style.top = position.y - scrollY + "px";
        StyleViewer.highlightElement.style.left = position.x - scrollX + "px";

        const fillWorker = (e, w, h) => {
            var t = e.top,
                r = e.right,
                b = e.bottom,
                l = e.left
            return [
                [t, l, 0, 0],
                [t, w, l, 0],
                [t, r, l + w, 0],
                [h, l, 0, t],
                [h, r, l + w, t],
                [b, l, 0, t + h],
                [b, w, l, t + h],
                [b, r, l + w, t + h]
            ]
        }
        var sizes = boxModel.getData(element);
        for (let i = 0; i < Object.values(sizes).length; i++) {
            for (let j = 0; j < Object.values(sizes)[i].length; j++) {
                sizes[Object.keys(sizes)[i]][Object.keys(sizes)[i][j]] = sizes[Object.keys(sizes)[i]][Object.keys(sizes)[i][j]] == "‒" ? 0 : sizes[Object.keys(sizes)[i]][Object.keys(sizes)[i][j]];
            }
        }
    }

    function checkCssSupport(property, value) {
        return CSS.supports(property, value);
    }

    function getMatchedCssRule(element, attribute) {
        const rules = Array.from(document.styleSheets).flatMap(sheet => Array.from(sheet.cssRules));
        const matchedRules = rules.filter(rule => {
            if (rule.style && rule.style.getPropertyValue(attribute)) {
                return element.matches(rule.selectorText);
            }
            return false;
        });
        return matchedRules.sort((a, b) => b.style.getPropertyPriority(attribute) - a.style.getPropertyPriority(attribute))[0];
    }

    function popupWorker(x, y, e) {
        var res = {
            x: x,
            y: y
        }
        if (x + e.offsetWidth > window.innerWidth) {
            if (x - e.offsetWidth < 0) {
                res.x = window.innerWidth - e.offsetWidth;
            } else {
                res.x = x - e.offsetWidth;
            }
        }
        if (y + e.offsetHeight > window.innerHeight) {
            if (y - e.offsetHeight < 0) {
                res.y = window.innerHeight - e.offsetHeight;
            } else {
                res.y = y - e.offsetHeight;
            }
        }
        return res;
    }

    function setPopup(detail, element) {
        var roundTo = function (num, decimal) {
            const isNumeric = n => !!Number(n);
            return isNumeric(num) == true ? Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal) : num;
        };

        var size = {};

        try {
            size = {
                width: element.getClientRects()[0].width,
                height: element.getClientRects()[0].height
            }
        } catch (e) { }

        var tag_name = detail.target.nodeName.toLowerCase();
        var className = detail.target.getAttribute("class") === "" || detail.target.getAttribute("class") === null || [...detail.target.classList].length < 1 ? "" : "." + [...detail.target.classList].join('.'); 
        // or detail.target.getAttribute("class").split(' ').filter(cn => cn.length > 0).join('.');

        var id = detail.target.getAttribute("id") != null ? "#" + detail.target.getAttribute("id") : "";
        className = removeHTMLTag(className);
        id = removeHTMLTag(id);
        tag_name = removeHTMLTag(tag_name);
        // StyleViewer.popupElement.innerHTML = "";

        var tempHTML = "";

        (function () {
            /*
            var a = document.createElement("div");
            a.className = "svjs-style-content";
            mask.appendChild(a);
            */
            tempHTML = `<div class="_css_viewer_info_element"><span class="_css_viewer_info_element_attribute" data-sv-cm="es"><span class="_css_viewer_info_element_tag">${tag_name}</span><span class="_css_viewer_info_element_id">${id}</span><span class="_css_viewer_info_element_classname">${className}</span></span><span class="_css_viewer_info_element_size"><span class="_css_viewer_info_width">${Math.round(size.width * 100) / 100}</span><span class="_css_viewer_info_height">${Math.round(size.height * 100) / 100}</span></span></div>`;
            /*getAllStyle(element)*/
            ElementStyle(element).concat(StyleSheets(element)).forEach(style => {
                var temp = "";
                style.content.forEach(j => {
                    var valid = {
                        key: /\-\-\w+/gi.test(j.name) ? true : isValidCSSKey(j.name) !== '',
                        value: /\-\-\w+/gi.test(j.name) ? true : isValidCSSValue(j.name, j.value.replaceAll("!important", "")) !== ''
                    }

                    var classNames = {
                        key: valid.key == false ? "style-line-unsupported" : "",
                        value: (valid.key == false || valid.value == false) ? "style-line-unsupported" : ""
                    }

                    // var valid = /\-\-\w+/gi.test(j.name) ? true : isValidCSSKey(j.name) !== '' && isValidCSSValue(j.name, j.value.replaceAll("!important", "")) !== '';
                    // var invalid_class = checkCssSupport(j.name, j.value.replaceAll("!important", "")) || /\-\-\w+/gi.test(j.name) ? "" : "style-line-unsupported";
                    // var applied = getMatchedCssRule(element, j.name) ? getMatchedCssRule(element, j.name).style.getPropertyValue(j.name) == j.value : false;

                    var randomTag = Hash(12);
                    var replacedURL = {};

                    var brackets = parseBrackets(j.value);

                    if (Object.keys(brackets).length > 0) {
                        // console.log(brackets);
                        Object.keys(brackets).forEach((start, i) => {
                            console.log('%c ' + Object.values(brackets)[i].pattern + j.value.slice(start, Object.values(brackets)[i].end), 'color: #6cff8a', `[${start}, ${Object.values(brackets)[i].end}]`);
                        })
                    }

                    j.value = j.value.replaceAll(/url\((.*?)\)/gi, (match, p1) => {
                        var id = Hash(8);
                        replacedURL[id] = `url(${formatLongURL(p1, false)})`;
                        return `${randomTag}-${id}-replaced`;
                    });

                    var result = j.value;
                    
                    if (valid.key == true && valid.value == true) {
                        result = generateColorBlock(j.value, element);
                    }

                    Object.values(replacedURL).forEach((url, i) => {
                        result = result.replace(`${randomTag}-${Object.keys(replacedURL)[i]}-replaced`, url);
                    })

                    temp += `
                    <div class='svjs-stylesheet ${classNames.key} ${(classNames.key != '' || classNames.value != '') ? 'svjs-stylesheet-warn' : ''}'>
                        <span class='svjs-stylesheet-key ${classNames.key}'>${j.name}</span>: <span class='svjs-stylesheet-value ${classNames.value}'>${result}</span>;
                    </div>`;
                })
                tempHTML += `<div class="style-group"><div class="style-origin">${formatStyleURL(style.ownerNode)}<span><span style="${style.selector == "element.style" ? "color: rgb(175 170 170);" : ""}">${formatSelector(style.selector, element)}</span><span> {</span></span></div>${temp}<div>}</div></div>`;
            });
        })();

        // Style Content

        var styleContentVDOM = parseHTML(tempHTML);
        var styleContent = StyleViewer.styleContent;

        clean(styleContent);
        diff(styleContentVDOM, styleContent);

        tippy('[data-tippy-content]', {
            theme: "translucent",
            followCursor: "horizontal"
        });

        // Box

        // box(element, StyleViewer.box).draw();
        boxModel.render(StyleViewer.box, boxModel.getData(element))

        // console.log(box(element, StyleViewer.box))

        StyleViewer.status.innerHTML = "Status : " + (StyleViewer.control == true ? "Fixed" : "Selecting");

        var pos = popupWorker(StyleViewer.mousePosition.x, StyleViewer.mousePosition.y, StyleViewer.popupElement);
        StyleViewer.popupElement.style.left = pos.x + "px";
        StyleViewer.popupElement.style.top = pos.y + "px";
    }

    function getStyle(a, c) {
        var b; if ((b = (a.ownerDocument || document).defaultView) && b.getComputedStyle) return c = c.replace(/([A-Z])/g, "-$1").toLowerCase(), b.getComputedStyle(a, null).getPropertyValue(c); if (a.currentStyle) return c = c.replace(/\-(\w)/g, function (d, e) { return e.toUpperCase() }), b = a.currentStyle[c], /^\d+(em|pt|%|ex)?$/i.test(b) ? function (d) { var e = a.style.left, f = a.runtimeStyle.left; a.runtimeStyle.left = a.currentStyle.left; a.style.left = d || 0; d = a.style.pixelLeft + "px"; a.style.left = e; a.runtimeStyle.left = f; return d; }(b) : b;
    };

    StyleViewer.control = false;

    StyleViewer.selectedElement = null;

    StyleViewer.temp = null;

    StyleViewer.mousePosition = {
        x: 0,
        y: 0
    }

    // 初始化
    StyleViewer.init = () => {
        if (initial == true) return console.error("The initialization function [ init ] can only be called once.");
        initial = true;
        StyleViewer.highlightElement = Element("div", `svjs-${hash.highlight} svjs-highlight-content svjs-highlight`, null, document.body);
        StyleViewer.popupElement = Element("div", `svjs-${hash.popup} svjs-popup`, null, document.body);

        StyleViewer.mask = document.createElement("div");
        StyleViewer.mask.style = "all: initial;";
        StyleViewer.mask.className = "sjvs-mask";
        StyleViewer.popupElement.appendChild(StyleViewer.mask);

        StyleViewer.styleContent = document.createElement("div");
        StyleViewer.styleContent.className = "svjs-style-content";
        StyleViewer.mask.appendChild(StyleViewer.styleContent);

        StyleViewer.box = document.createElement("div");
        StyleViewer.box.className = "svjs-box";
        StyleViewer.mask.appendChild(StyleViewer.box);

        StyleViewer.status = document.createElement("div");
        StyleViewer.status.className = "svjs-status";
        StyleViewer.status.innerHTML = "Status : " + (StyleViewer.control == true ? "Fixed" : "Selecting");
        StyleViewer.mask.appendChild(StyleViewer.status);

        var listens = ["mousemove", "mousedown", "mouseup", "click", "touchmove", "touchstart", "touchend", "touchcancel"];
        window.addEventListener("keydown", (e) => {
            if (e.altKey) {
                e.preventDefault();
                if (StyleViewer.control == true) {
                    StyleViewer.popupElement.classList.remove("svjs-popup-control");
                    StyleViewer.control = false;
                } else {
                    StyleViewer.control = true;
                    StyleViewer.popupElement.classList.add("svjs-popup-control");
                }
                if ($(".svjs-status")) {
                    $(".svjs-status").innerHTML = "Status : " + (StyleViewer.control == true ? "Fixed" : "Selecting");
                }
                return false;
            }
        })

        window.addEventListener("scroll", () => {
            if (!StyleViewer.selectedElement || !StyleViewer.temp) return;
            var element = StyleViewer.selectedElement;
            var e = StyleViewer.temp;
            highlightElement(element);
            var pos = popupWorker(StyleViewer.mousePosition.x, StyleViewer.mousePosition.y, StyleViewer.popupElement);
            StyleViewer.popupElement.style.left = pos.x + "px";
            StyleViewer.popupElement.style.top = pos.y + "px";
        })

        window.addEventListener("wheel", () => {
            if (!StyleViewer.selectedElement || !StyleViewer.temp) return;
            var element = StyleViewer.selectedElement;
            var e = StyleViewer.temp;
            highlightElement(element);
            var pos = popupWorker(StyleViewer.mousePosition.x, StyleViewer.mousePosition.y, StyleViewer.popupElement);
            StyleViewer.popupElement.style.left = pos.x + "px";
            StyleViewer.popupElement.style.top = pos.y + "px";
        })

        window.onresize = () => {
            if (!StyleViewer.selectedElement || !StyleViewer.temp) return;
            var element = StyleViewer.selectedElement;
            var e = StyleViewer.temp;
            highlightElement(element);
            setPopup(e, element);
        }


        /*
        window.addEventListener("keyup", (e) => {
            StyleViewer.popupElement.classList.remove("svjs-popup-control");
            control = false;
        })
        */
        window.addEventListener("blur", () => {
            if (StyleViewer.control == true) return;
            StyleViewer.popupElement.classList.remove("svjs-popup-control");
        })
        listens.forEach(l => {
            window.addEventListener(l, (e) => {
                if (StyleViewer.selecting !== true) return;
                if (StyleViewer.control === true) return;
                StyleViewer.selectedElement = e.target;
                StyleViewer.temp = e;
                StyleViewer.mousePosition = {
                    x: e.clientX,
                    y: e.clientY
                }
                var element = e.target;
                highlightElement(element);
                setPopup(e, element);
            })
        })

        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target == StyleViewer.popupElement || StyleViewer.popupElement.contains(mutation.target) || mutation.target == StyleViewer.highlightElement || mutation.target != StyleViewer.selectedElement) return;
                if (mutation.type === 'attributes') {
                    if (!StyleViewer.selectedElement || !StyleViewer.temp) return;
                    var element = StyleViewer.selectedElement;
                    var e = StyleViewer.temp;
                    if (!isElement(element)) return;
                    highlightElement(element);
                    setPopup(e, element);
                }
            })
        })

        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
        })
    }

    // 開始選擇元素
    StyleViewer.enterSelectingMode = () => {
        StyleViewer.popupElement.classList.add("show");
        StyleViewer.highlightElement.classList.add("show");
        StyleViewer.selecting = true;
        StyleViewer.control = false;
        StyleViewer.popupElement.classList.remove("svjs-popup-control");
    }

    // 結束選擇元素
    StyleViewer.exitSelectingMode = () => {
        StyleViewer.popupElement.classList.remove("show");
        StyleViewer.highlightElement.classList.remove("show");
        StyleViewer.selecting = false;
        StyleViewer.control = false;
        StyleViewer.popupElement.classList.remove("svjs-popup-control");
    }

    // 取得所有樣式
    StyleViewer.getAllStyle = (target) => {
        return ElementStyle(target).concat(StyleSheets(target));
    }

    // 取得陣列中的樣式
    StyleViewer.getStylesByArray = (target, style) => {
        var arr = [];
        style.forEach(n => {
            arr.push({
                name: n,
                value: getStyle(target, n)
            });
        })
        return arr;
    }

    // 取得字串中的樣式 ( 以空格分開 )
    StyleViewer.getStylesByString = (target, style) => {
        var style = style.split(" ");
        var arr = [];
        style.forEach(n => {
            arr.push({
                name: n,
                value: getStyle(target, n)
            });
        })
        return arr;
    }

/************************* 未完成 *************************/
/****/    // 禁止 StyleViewer 對字串中的選擇器作用
/****/    StyleViewer.filterByString = (selectors) => {
        /****/
        /****/
        /****/
    }
/****/
/****/    // 禁止 StyleViewer 對陣列中的選擇器作用
/****/    StyleViewer.filterByArray = (selectors) => {
        /****/
        /****/
        /****/
    }
/****/
/****/    // 刪除過濾器
/****/    StyleViewer.removeFilter = (filters) => {
        /****/
        /****/
        /****/
    }
    /**********************************************************/

    window.StyleViewer = StyleViewer;
})()