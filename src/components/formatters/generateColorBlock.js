import replaceCSSVars from "./replaceCSSVars";
import colorCodeRegex from "../datas/colorCodeRegex";
import colorNames from "../datas/colorNames";

export default function generateColorBlock(str, element) {
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