/**
 * Code by Siyu1017 (c) 2023 - 2024
 * All rights reserved.
 */

"use strict";

function Hash(n, c) { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };

export default function StyleSheets(element) {
    var res_arr = [];
    const url_substitute_regexp = /sv_rd-ts\.[0-9]{13}hash\.[A-Za-z0-9]{96}/i;
    const url_search_regexp = /url\((.*?)\)/gi;
    try {
        for (var i = 0; i < document.styleSheets.length; i++) {
            try {
                var ownerNode = document.styleSheets[i].ownerNode;
                var cssrules = document.styleSheets[i].cssRules;
                Object.values(cssrules).forEach(c => {
                    if (element.matches(c.selectorText)) {
                        var temp = res_arr.push({
                            selector: c.selectorText.toString(),
                            url: ownerNode.getAttribute("href") ? ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`,
                            content: [],
                            ownerNode: ownerNode,
                        })
                        var css_content = c.cssText.split("{")[1].slice(0, -1);
                        var replaceTemp = {};
                        var css_arr = css_content.replace(url_search_regexp, (match, p1) => {
                            var id = "sv_rd-ts." + new Date().getTime() + "hash." + Hash(96);
                            replaceTemp[id] = match;
                            return id;
                        }).split(";");
                        css_arr.pop();
                        css_arr.forEach(s => {
                            var val = s.slice(s.split(":")[0].length + 1).trim();
                            if (url_substitute_regexp.test(val)) {
                                val = val.replace(url_substitute_regexp, (match, p1) => {
                                    return replaceTemp[match];
                                })
                            }
                            res_arr[temp - 1].content.push({
                                name: s.split(":")[0].trim(),
                                value: val
                            })
                        })
                    }
                })
            } catch (e) {
                console.warn("Warn : Uncaught exception.\nDetails :", e);
            };
        }
    } catch (e) { }
    return res_arr;
}