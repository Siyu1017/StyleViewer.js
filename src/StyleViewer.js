/**
 * Code by Wetrain (c) 2023
 * All rights reserved.
 * StyleViewer.js
 */

"use strict";

import "./StyleViewer.css";
import "./lib/box.min.js";
import "./lib/box.min.css";
import ElementStyle from "./components/css/elementstyle.js";
import StyleSheets from "./components/css/stylesheets.js";
import { styleURLFormat, valueURLFormat, styleURLTextFormat, selectorFormat, replaceCSSVars, Color_regex, toCamelCase, removeHTMLTag } from "./components/format/format.js";
import isValidCSSKey from "./components/verifier/isValidCSSKey.js";
import isValidCSSValue from "./components/verifier/isValidCSSValue.js";

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
        target: document.body,
        selecting: false,
        filters: ["StyleViewer", []],
        version: "1.0.0"
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

    function popupWorker(x, y, e) {
        var res = {
            x: x,
            y: y
        }
        if (x + e.offsetWidth > document.documentElement.scrollWidth) {
            if (x - e.offsetWidth < 0) {
                res.x = document.documentElement.scrollWidth - e.offsetWidth;
            } else {
                res.x = x - e.offsetWidth;
            }
        }
        if (y + e.offsetHeight > document.documentElement.scrollHeight || y + e.offsetHeight > window.innerHeight) {
            if (y - document.documentElement.scrollTop < 0) {
                res.y = document.documentElement.scrollTop;
            } else if (y - e.offsetHeight < document.documentElement.scrollTop) {
                res.y = document.documentElement.scrollTop;
            } else {
                res.y = y - e.offsetHeight;
            }
        }
        return res;
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
        StyleViewer.highlightElement.style.top = position.y + "px";
        StyleViewer.highlightElement.style.left = position.x + "px";

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
        var sizes = {
            content: box(element).data.content,
            padding: box(element).data.padding,
            border: box(element).data.border,
            margin: box(element).data.margin
        }
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

    function setPopup(d, e) {
        var roundTo = function (num, decimal) {
            const isNumeric = n => !!Number(n);
            return isNumeric(num) == true ? Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal) : num;
        };

        var detail = d;
        var element = e;

        var size = {
            width: element.getClientRects()[0].width,
            height: element.getClientRects()[0].height
        }
        var tag_name = detail.target.nodeName.toLowerCase();
        var className = detail.target.getAttribute("class") === "" || detail.target.getAttribute("class") === null || tag_name == "path" ? "" : "." + detail.target.getAttribute("class").replaceAll(" ", ".");
        var id = detail.target.getAttribute("id") != null ? "#" + detail.target.getAttribute("id") : "";
        className = removeHTMLTag(className);
        id = removeHTMLTag(id);
        tag_name = removeHTMLTag(tag_name);
        StyleViewer.popupElement.innerHTML = "";
        var mask = document.createElement("div");
        mask.style = "all: initial;";
        (function () {
            var a = document.createElement("div");
            a.className = "svjs-style-content";
            mask.appendChild(a);
            a.innerHTML = `<div class="_css_viewer_info_element"><span class="_css_viewer_info_element_attribute" data-sv-cm="es"><span class="_css_viewer_info_element_tag">${tag_name}</span><span class="_css_viewer_info_element_id">${id}</span><span class="_css_viewer_info_element_classname">${className}</span></span><span class="_css_viewer_info_element_size"><span class="_css_viewer_info_width">${Math.round(size.width * 100) / 100}</span><span class="_css_viewer_info_height">${Math.round(size.height * 100) / 100}</span></span></div>`;
            /*getAllStyle(element)*/
            ElementStyle(element).concat(StyleSheets(element)).forEach(s => {
                var temp = "";
                s.content.forEach(j => {
                    var valid = /\-\-\w+/gi.test(j.name) ? true : isValidCSSKey(j.name) !== '' && isValidCSSValue(j.name, j.value.replaceAll("!important", "")) !== '';
                    var invalid_class = checkCssSupport(j.name, j.value.replaceAll("!important", "")) || /\-\-\w+/gi.test(j.name) ? "" : "style-line-unsupported";
                    // var applied = getMatchedCssRule(element, j.name) ? getMatchedCssRule(element, j.name).style.getPropertyValue(j.name) == j.value : false;
                    j.value = j.value.replaceAll(/url\((.*?)\)/gi, (match, p1) => {
                        return `url(${valueURLFormat(p1, false)})`;
                    });
                    temp += `<div style='text-indent: ${invalid_class != "" ? "0" : "1rem"};font-family: monospace;${valid == false ? "text-decoration: line-through;" : ""}'><span style='text-indent: 1rem;color: #c80000; font-family: monospace;' class='${invalid_class}'>${j.name}</span>: ${Color_regex(j.value, element, !valid)};</div>`
                })
                a.innerHTML += `<div class="style-group"><div class="style-origin">${styleURLFormat(s.ownerNode)}<span><span style="${s.selector == "element.style" ? "color: rgb(175 170 170);" : ""}">${selectorFormat(s.selector, element)}</span><span> {</span></span></div>${temp}<div>}</div></div>`;
            });
        })();
        var b = document.createElement("div");
        b.className = "svjs-box";
        mask.appendChild(b);
        box(element, b).draw();
        StyleViewer.popupElement.appendChild(mask);
        var pos = popupWorker(detail.pageX, detail.pageY, StyleViewer.popupElement);
        StyleViewer.popupElement.style.left = pos.x + "px";
        StyleViewer.popupElement.style.top = pos.y + "px";
    }

    function getStyle(a, c) {
        var b; if ((b = (a.ownerDocument || document).defaultView) && b.getComputedStyle) return c = c.replace(/([A-Z])/g, "-$1").toLowerCase(), b.getComputedStyle(a, null).getPropertyValue(c); if (a.currentStyle) return c = c.replace(/\-(\w)/g, function (d, e) { return e.toUpperCase() }), b = a.currentStyle[c], /^\d+(em|pt|%|ex)?$/i.test(b) ? function (d) { var e = a.style.left, f = a.runtimeStyle.left; a.runtimeStyle.left = a.currentStyle.left; a.style.left = d || 0; d = a.style.pixelLeft + "px"; a.style.left = e; a.runtimeStyle.left = f; return d; }(b) : b;
    };

    StyleViewer.control = false;

    // 初始化
    StyleViewer.init = (target) => {
        if (target !== null) { StyleViewer.target = target; };
        if (initial == true) return console.error("The initialization function [ init ] can only be called once.");
        initial = true;
        StyleViewer.highlightElement = Element("div", `svjs-${hash.highlight} svjs-highlight-content svjs-highlight`, null, document.body);
        StyleViewer.popupElement = Element("div", `svjs-${hash.popup} svjs-popup`, null, document.body);
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
                return false;
            }
        })
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
            target.addEventListener(l, (e) => {
                if (StyleViewer.selecting !== true) return;
                if (StyleViewer.control === true) return;
                var element = e.target;
                highlightElement(element);
                setPopup(e, element);
            })
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

    window.onresize = () => {
        StyleViewer.highlightElement.style.width = 0 + "px";
        StyleViewer.highlightElement.style.height = 0 + "px";
        StyleViewer.highlightElement.style.top = 0 + "px";
        StyleViewer.highlightElement.style.left = 0 + "px";
    }

    window.StyleViewer = StyleViewer;
})()