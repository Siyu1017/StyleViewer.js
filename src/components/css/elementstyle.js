/**
 * Code by Siyu1017 (c) 2023 - 2024
 * All rights reserved.
 */

"use strict";

import { getAllCSSComponentsWithBrackets } from "../format/format.js";

function Hash(n, c) { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };

export default function ElementStyle(element) {
    var result = [
        {
            selector: "element.style",
            url: "",
            content: []
        }
    ];

    const brackets_substitute_regexp = /sv_rd-ts\.[0-9]{13}hash\.[A-Za-z0-9]{96}/i;
    // const brackets_regexp = /\((.*?)\)/gi;
    const brackets_regexp = /url\([\s\S]*?\)+/gi;

    try {
        var elementStyle = element.getAttribute("style");
        var replaceTemp = {};

        // 刪除註解內容
        if (element.getAttribute("style") != null && element.getAttribute("style") != "") {
            if (element.getAttribute("style").trim().length > 0) {
                elementStyle = elementStyle.replaceAll(/\/\*[\s\S]*?\*\//gi, "");
            }
        }

        // 替換括號內容
        var brackets = getAllCSSComponentsWithBrackets(elementStyle);

        Object.keys(brackets).forEach((start, i) => {
            var id = "sv_rd-ts." + new Date().getTime() + "hash." + Hash(96);
            replaceTemp[id] = Object.values(brackets)[i].pattern + elementStyle.slice(start, Object.values(brackets)[i].end);
            elementStyle = elementStyle.replace(Object.values(brackets)[i].pattern + elementStyle.slice(start, Object.values(brackets)[i].end), id);
        })

        if (elementStyle !== null && elementStyle.trim() !== "" && elementStyle.split(":").length > 1) {
            var content = result[0].content;
            if (elementStyle.split(":")[1].trim() !== "") {
                if (elementStyle.split(":")[1] && elementStyle.split(";").length == 0) {
                    var val = elementStyle.split(":")[1].trim();
                    if (brackets_substitute_regexp.test(val)) {
                        val = val.replace(brackets_substitute_regexp, (match, p1) => {
                            return replaceTemp[match];
                        })
                    }
                    result[0].content.push({
                        name: elementStyle.split(":")[0].trim(),
                        value: val
                    });
                } else {
                    for (let i = 0; i < elementStyle.split(";").length; i++) {
                        if (elementStyle.split(";")[i].split(":")[0].trim() !== "" && elementStyle.split(";")[i].split(":")[1].trim() !== "") {
                            var val = elementStyle.split(";")[i].slice(elementStyle.split(";")[i].split(":")[0].length + 1).trim();
                            if (brackets_substitute_regexp.test(val)) {
                                val = val.replace(brackets_substitute_regexp, (match, p1) => {
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
    return result;
}


