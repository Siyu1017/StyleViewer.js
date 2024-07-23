import colorCodeRegex from "../datas/colorCodeRegex";
import colorNames from "../datas/colorNames";

export default function replaceCSSVars(str, element) {
    function varIsColor(str) {
        if (colorCodeRegex.test(str) == true) {
            if (str.trim().startsWith('#') || str.trim().startsWith('rgb') || str.trim().startsWith('hsl')) {
                return true;
            } else {
                return false;
            }
        }
        if (colorNames.includes(str.toLowerCase())) return true;
        return false;
    }

    return str.replaceAll(/var\((--.*?)\)/g, (match, p1) => {
        // console.log(`Match: ${match},\n P1: ${p1}`)
        var defined = getComputedStyle(element).getPropertyValue(p1) !== '';
        if (defined == false) {
            return `var(<span class="undefined-variable">${p1}</span>)`;
        } else if (varIsColor(getComputedStyle(element).getPropertyValue(p1)) == true) {
            return `<span class='_css_editor_info_stylesheets_content_styles_color defined-variable'><span style="background: ${getComputedStyle(element).getPropertyValue(p1)}" class='_css_editor_info_stylesheets_content_styles_color_content defined-variable'></span></span>var(<span class="defined-variable" data-tippy-content="${getComputedStyle(element).getPropertyValue(p1)}">${p1}</span>)`;
        } else {
            return `var(<span class="defined-variable" data-tippy-content="${getComputedStyle(element).getPropertyValue(p1)}">${p1}</span>)`;
        }
    });
}
