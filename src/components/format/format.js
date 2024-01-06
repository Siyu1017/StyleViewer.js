import isElement from "../verifier/isElement";
import { colorCodeRegex, color_text_regex } from "../regex/regex.js";

function is_color(str) {
    return colorCodeRegex.test(str) == true || color_text_regex.test(str.toUpperCase()) == true;
}

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
    if (value.length <= 100) return `<a href="${value.toString()}" target="_blank" class="style-value-url-link">${value}</a>`;
    return `<a href="${value.toString()}" target="_blank" class="style-value-url-link">${value.slice(0, 50) + "…" + value.slice(-49)}</a>`;
}

function styleURLFormat(ownerNode) {
    return isElement(ownerNode) != true ? "" : `<${ownerNode.getAttribute("href") ? "a target='_blank' href='" + ownerNode.getAttribute("href") + "'" : "span"} style='color: ${ownerNode.getAttribute("href") ? "auto" : "rgb(175 170 170)"};float: right;margin-left: 15px;text-wrap: nowrap;height: 15px;margin-bottom: -1px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;direction: rtl;text-align: left;'>${ownerNode.getAttribute("href") ? styleURLTextFormat(ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1)) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`}</${ownerNode.getAttribute("href") ? "a" : "span"}>`;
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

function replaceCSSVars(str, element, unsupported) {
    return str.replaceAll(/var\((--.*?)\)/g, (match, p1) => {
        if (unsupported == true) {
            return match;
        }
        var defined = unsupported == true ? false : getComputedStyle(element).getPropertyValue(p1) !== '';
        if (defined == false) {
            return `var(<span class="undefined-variable">${p1}</span>)`;
        } else if (is_color(getComputedStyle(element).getPropertyValue(p1)) == true) {
            return `<span class='_css_editor_info_stylesheets_content_styles_color defined-variable'><span style='background: ${getComputedStyle(element).getPropertyValue(p1)}' class='_css_editor_info_stylesheets_content_styles_color_content defined-variable'></span></span>var(<span class="defined-variable">${p1}</span>)`;
        } else {
            return `var(<span class="defined-variable">${p1}</span>)`;
        }
    });
}

function Color_regex(str, element, unsupported) {
    var matches = str.replaceAll(colorCodeRegex, match => {
        return `<span><span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${match}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}</span>`;
    });

    matches = matches.replaceAll(color_text_regex, match => {
        return `<span><span class='_css_editor_info_stylesheets_content_styles_color'><span style='background: ${match}' class='_css_editor_info_stylesheets_content_styles_color_content'></span></span>${match}</span>`;
    })

    matches = replaceCSSVars(matches, element, unsupported);

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
    styleURLFormat, valueURLFormat, styleURLTextFormat, selectorFormat, replaceCSSVars, Color_regex, toCamelCase, removeHTMLTag
}