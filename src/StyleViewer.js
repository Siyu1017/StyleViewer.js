/**
 * Code by Wetrain (c) 2023
 * All rights reserved.
 * StyleViewer.js v1.1.0
 */

"use strict";

import "./StyleViewer.css";
import "./lib/box.min.js";
import "./lib/box.min.css";

(() => {
    const hash = {
        highlight: Hash(24, "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-_abcdefghijklmnopqrstuvwxyz"),
        popup: Hash(24, "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPasdfghj2644200123456789"),
    }

    const StyleViewer = {
        target: document.body,
        selecting: false,
        filters: ["StyleViewer", []],
    };

    const colorCodeRegex = /hsla?\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(,\s*0?\.?\d{1,2})?\)|#(?:[0-9a-fA-F]{3}){1,2}|(rgb|hsl)a?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*0?\.?\d*)?\)/g;

    const color_text_regex = /^(?:ALICEBLUE|ANTIQUEWHITE|AQUA|AQUAMARINE|AZURE|BEIGE|BISQUE|BLACK|BLANCHEDALMOND|BLUE|BLUEVIOLET|BROWN|BURLYWOOD|CADETBLUE|CHARTREUSE|CHOCOLATE|CORAL|CORNFLOWERBLUE|CORNSILK|CRIMSON|CYAN|DARKBLUE|DARKCYAN|DARKGOLDENROD|DARKGRAY|DARKGREEN|DARKKHAKI|DARKMAGENTA|DARKOLIVEGREEN|DARKORANGE|DARKORCHID|DARKRED|DARKSALMON|DARKSEAGREEN|DARKSLATEBLUE|DARKSLATEGRAY|DARKTURQUOISE|DARKVIOLET|DEEPPINK|DEEPSKYBLUE|DIMGRAY|DODGERBLUE|FLORALWHITE|FORESTGREEN|FUCHSIA|GAINSBORO|GHOSTWHITE|GOLD|GOLDENROD|GRAY|GREEN|GREENYELLOW|HONEYDEW|HOTPINK|INDIANRED|INDIGO|IVORY|KHAKI|LAVENDER|LAVENDERBLUSH|LAWNGREEN|LEMONCHIFFON|LIGHTBLUE|LIGHTCORAL|LIGHTCYAN|LIGHTGOLDENRODYELLOW|LIGHTGRAY|LIGHTGREEN|LIGHTPINK|LIGHTSALMON|LIGHTSEAGREEN|LIGHTSKYBLUE|LIGHTSLATEGRAY|LIGHTSTEELBLUE|LIGHTYELLOW|LIME|LIMEGREEN|LINEN|MAGENTA|MAROON|MEDIUMAQUAMARINE|MEDIUMBLUE|MEDIUMORCHID|MEDIUMPURPLE|MEDIUMSEAGREEN|MEDIUMSLATEBLUE|MEDIUMSPRINGGREEN|MEDIUMTURQUOISE|MEDIUMVIOLETRED|MIDNIGHTBLUE|MINTCREAM|MISTYROSE|MOCCASIN|NAVAJOWHITE|NAVY|OLDLACE|OLIVE|OLIVEDRAB|ORANGE|ORANGERED|ORCHID|PALEGOLDENROD|PALEGREEN|PALETURQUOISE|PALEVIOLETRED|PAPAYAWHIP|PEACHPUFF|PERU|PINK|PLUM|POWDERBLUE|PURPLE|REBECCAPURPLE|RED|ROSYBROWN|ROYALBLUE|SADDLEBROWN|SALMON|SANDYBROWN|SEAGREEN|SEASHELL|SIENNA|SILVER|SKYBLUE|SLATEBLUE|SLATEGRAY|SNOW|SPRINGGREEN|STEELBLUE|TAN|TEAL|THISTLE|TOMATO|TURQUOISE|VIOLET|WHEAT|WHITE|WHITESMOKE|YELLOW|YELLOWGREEN)$/gi;

    function replaceCssVars(str, element) {
        return str.replace(/var\((--.*?)\)/g, (match, p1) => {
            return is_color(getComputedStyle(element).getPropertyValue(p1)) == true ? `<span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${getComputedStyle(element).getPropertyValue(p1)}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}` : match || match;
        });
    }

    function removeHTMLTag(content) {
        return content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    function is_color(str) {
        return colorCodeRegex.test(str) == true || color_text_regex.test(str.toUpperCase()) == true;
    }

    function Color_regex(str, element) {
        var matches = str.replace(colorCodeRegex, match => {
            return `<span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${match}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}`;
        });

        matches = matches.replace(color_text_regex, match => {
            return `<span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${match}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}`;

        })

        matches = replaceCssVars(matches, element);

        return matches ? matches : str;
    }

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

    function isElement(obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch (e) {
            return (typeof obj === "object") &&
                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object");
        }
    }

    function styleURLTextFormat(org) {
        if (org.length <= 21) return org;
        return org.slice(0, 11) + "…" + org.slice(-9)
    }

    function styleURLFormat(ownerNode) {
        return isElement(ownerNode) != true ? "" : `<${ownerNode.getAttribute("href") ? "a target='_blank' href='" + ownerNode.getAttribute("href") + "'" : "span"} style='color: rgb(137 137 137);float: right;padding-left: 15px;text-wrap: nowrap;height: 15px;margin-bottom: -1px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;direction: rtl;text-align: left;'>${ownerNode.getAttribute("href") ? styleURLTextFormat(ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1)) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`}</${ownerNode.getAttribute("href") ? "a" : "span"}>`;
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
        (function () {
            var a = document.createElement("div");
            a.className = "svjs-style-content";
            StyleViewer.popupElement.appendChild(a);
            a.innerHTML = `<div class="_css_viewer_info_element"><span class="_css_viewer_info_element_attribute"><span class="_css_viewer_info_element_tag">${tag_name}</span><span class="_css_viewer_info_element_id">${id}</span><span class="_css_viewer_info_element_classname">${className}</span></span><span class="_css_viewer_info_element_size"><span class="_css_viewer_info_width">${Math.round(size.width * 100) / 100}</span><span class="_css_viewer_info_height">${Math.round(size.height * 100) / 100}</span></span></div>`;
            getAllStyle(element).forEach(s => {
                var temp = "";
                s.content.forEach(j => {
                    temp += `<div style='text-indent: 1rem;font-family: monospace;'><span style='text-indent: 1rem;color: #c80000; font-family: monospace;'>${j.name}</span>: ${Color_regex(j.value, element)};</div>`
                })
                a.innerHTML += `<div class="style-group"><div class="style-origin">${styleURLFormat(s.ownerNode)}<span style="${s.selector == "element.style" ? "color: rgb(137 137 137);" : ""}">${s.selector} {</span><span style="margin-left: 4px;text-align: right;flex:40%;max-width: 40%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><!--a href="${s.url}" style="${s.url == "<style>" ? "color:rgb(137 137 137);" : "color:rgb(137 137 137);text-decoration: underline;"}">${s.url}</a--></span></div>${temp}<div>}</div></div>`;
            });
        })();
        var b = document.createElement("div");
        b.className = "svjs-box";
        StyleViewer.popupElement.appendChild(b);
        box(element, b).draw();
        var pos = popupWorker(detail.pageX, detail.pageY, StyleViewer.popupElement);
        StyleViewer.popupElement.style.left = pos.x + "px";
        StyleViewer.popupElement.style.top = pos.y + "px";
    }

    function getStyle(a, c) {
        var b; if ((b = (a.ownerDocument || document).defaultView) && b.getComputedStyle) return c = c.replace(/([A-Z])/g, "-$1").toLowerCase(), b.getComputedStyle(a, null).getPropertyValue(c); if (a.currentStyle) return c = c.replace(/\-(\w)/g, function (d, e) { return e.toUpperCase() }), b = a.currentStyle[c], /^\d+(em|pt|%|ex)?$/i.test(b) ? function (d) { var e = a.style.left, f = a.runtimeStyle.left; a.runtimeStyle.left = a.currentStyle.left; a.style.left = d || 0; d = a.style.pixelLeft + "px"; a.style.left = e; a.runtimeStyle.left = f; return d; }(b) : b;
    };

    const getAllStyle = (element) => {
        var RS = [
            {
                selector: "element.style",
                url: "",
                content: []
            }
        ];
        var elementStyle = element.getAttribute("style");
        if (element.getAttribute("style") != null && element.getAttribute("style") != "") {
            if (element.getAttribute("style").trim().length > 0) {
                elementStyle = element.getAttribute("style").replaceAll(/\/\*[\s\S]*?\*\//gi, "");
            }
        }
        if (elementStyle !== null && elementStyle.trim() !== "" && elementStyle.split(":").length > 1) {
            var content = RS[0].content;
            if (elementStyle.split(":")[1].trim() !== "") {
                if (elementStyle.split(":")[1] && elementStyle.split(";").length == 0) {
                    RS[0].content.push({
                        name: elementStyle.split(":")[0].trim().toString(),
                        value: elementStyle.split(":")[1].trim().toString()
                    });
                } else {
                    for (let i = 0; i < elementStyle.split(";").length; i++) {
                        if (elementStyle.split(";")[i].split(":")[0].trim() !== "" && elementStyle.split(";")[i].split(":")[1].trim() !== "") {
                            content.push({
                                name: elementStyle.split(";")[i].split(":")[0].trim().toString(),
                                value: elementStyle.split(";")[i].slice(elementStyle.split(";")[i].split(":")[0].length + 1).trim().toString()
                            })
                        }
                    }
                }
            }
        }
        if (location.href.split("://")[0] != "file") {
            for (var i = 0; i < document.styleSheets.length; i++) {
                try {
                    var ownerNode = document.styleSheets[i].ownerNode;
                    var cssrules = document.styleSheets[i].cssRules;
                    Object.values(cssrules).forEach(c => {
                        if (element.matches(c.selectorText)) {
                            var temp = RS.push({
                                selector: c.selectorText.toString(),
                                url: ownerNode.getAttribute("href") ? ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`,
                                content: [],
                                ownerNode: ownerNode,
                            })
                            var css_content = c.cssText.split("{")[1].slice(0, -1);
                            /*
                            for (let j = 0; j < css_content.split(";").length; j++) {
                                if (css_content.split(";")[i].split(":")[0].trim() !== "" && css_content.split(";")[i].split(":")[1].trim() !== "") {
                                    RS[temp - 1].content.push({
                                        name: css_content.split(";")[i].split(":")[0].trim(),
                                        value: css_content.split(";")[i].split(":")[1].trim()
                                    })
                                }
                            }
                            */
                            var css_arr = css_content.split(";");
                            css_arr.pop();
                            css_arr.forEach(s => {
                                RS[temp - 1].content.push({
                                    name: s.split(":")[0].trim().toString(),
                                    value: s.slice(s.split(":")[0].length + 1).trim().toString()
                                })
                                // CSS_Viewer_color_regex(s.split(":")[1].trim(), e.target)
                            })
                        }
                    })
                } catch (e) {
                    console.warn("Warn : Uncaught exception.\nDetails :", e);
                };
            }
        }
        return RS;
    }

    StyleViewer.control = false;

    // 初始化
    StyleViewer.init = (target) => {
        if (target !== null) { StyleViewer.target = target; };
        StyleViewer.highlightElement = Element("div", `svjs-${hash.highlight} svjs-highlight-content svjs-highlight`, null, document.body);
        StyleViewer.popupElement = Element("div", `svjs-${hash.popup} svjs-popup`, null, document.body);
        var listens = ["mousemove", "mousedown", "mouseup", "click", "touchmove", "touchstart", "touchend", "touchcancel"];
        /*
        window.addEventListener("keydown", (e) => {
            if (e.altKey) {
                control = true;
                StyleViewer.popupElement.classList.add("svjs-popup-control");
                e.preventDefault();
                return false;
            } else {
                StyleViewer.popupElement.classList.remove("svjs-popup-control");
                control = false;
            }
        })
        */
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
        return getAllStyle(target);
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
    }
/****/
/****/    // 禁止 StyleViewer 對陣列中的選擇器作用
/****/    StyleViewer.filterByArray = (selectors) => {
        /****/
        /****/
    }
/****/
/****/    // 刪除過濾器
/****/    StyleViewer.removeFilter = (filters) => {
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