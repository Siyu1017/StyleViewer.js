/**
 * Code by Wetrain (c) 2023
 * All rights reserved.
 */

"use strict";

function Hash(n, c) { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };

export default function ElementStyle(element) {
    var res = [
        {
            selector: "element.style",
            url: "",
            content: []
        }
    ];
    const url_substitute_regexp = /sv_rd-ts\.[0-9]{13}hash\.[A-Za-z0-9]{96}/i;
    const url_search_regexp = /url\((.*?)\)/gi;
    try {
        var elementStyle = element.getAttribute("style");
        var replaceTemp = {};
        elementStyle = elementStyle.replace(url_search_regexp, (match, p1) => {
            var id = "sv_rd-ts." + new Date().getTime() + "hash." + Hash(96);
            replaceTemp[id] = match;
            return id;
        })
        if (element.getAttribute("style") != null && element.getAttribute("style") != "") {
            if (element.getAttribute("style").trim().length > 0) {
                elementStyle = element.getAttribute("style").replaceAll(/\/\*[\s\S]*?\*\//gi, "");
            }
        }
        if (elementStyle !== null && elementStyle.trim() !== "" && elementStyle.split(":").length > 1) {
            var content = res[0].content;
            if (elementStyle.split(":")[1].trim() !== "") {
                if (elementStyle.split(":")[1] && elementStyle.split(";").length == 0) {
                    var val = elementStyle.split(":")[1].trim();
                    if (url_substitute_regexp.test(val)) {
                        val = val.replace(url_substitute_regexp, (match, p1) => {
                            return replaceTemp[match];
                        })
                    }
                    res[0].content.push({
                        name: elementStyle.split(":")[0].trim(),
                        value: val
                    });
                } else {
                    for (let i = 0; i < elementStyle.split(";").length; i++) {
                        if (elementStyle.split(";")[i].split(":")[0].trim() !== "" && elementStyle.split(";")[i].split(":")[1].trim() !== "") {
                            var val = elementStyle.split(";")[i].slice(elementStyle.split(";")[i].split(":")[0].length + 1).trim();
                            if (url_substitute_regexp.test(val)) {
                                val = val.replace(url_substitute_regexp, (match, p1) => {
                                    return replaceTemp[match]
                                })
                            }
                            content.push({
                                name: elementStyle.split(";")[i].split(":")[0].trim(),
                                value: val
                            })
                        }
                    }
                }
            }
        }
    } catch (e) { }
    return res;
}


