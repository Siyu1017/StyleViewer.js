/**
 * Code by Wetrain (c) 2023
 * All rights reserved.
 * StyleViewer.js v0.0.1-alpha
 */

"use strict";

const getStyle = (element) => {
    var RS = [
        {
            selector: "element.style",
            url: "",
            content: []
        }
    ];
    var elementStyle = element.getAttribute("style");
    if (elementStyle !== null && elementStyle !== "") {
        var content = RS[0].content;
        if (elementStyle.split(":")[1].trim() !== "") {
            if (elementStyle.split(":")[1] && elementStyle.split(";").length == 0) {
                RS[0].content.push({
                    name: elementStyle.split(":")[0].trim(),
                    value: elementStyle.split(":")[1].trim()
                });
            } else {
                for (let i = 0; i < elementStyle.split(";").length; i++) {
                    if (elementStyle.split(";")[i].split(":")[0].trim() !== "" && elementStyle.split(";")[i].split(":")[1].trim() !== "") {
                        content.push({
                            name: elementStyle.split(";")[i].split(":")[0].trim(),
                            value: elementStyle.split(";")[i].split(":")[1].trim()
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
                            selector: c.selectorText,
                            url: ownerNode.getAttribute("href") ? ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`,
                            content: []
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
                                name: s.split(":")[0].trim(),
                                value: s.split(":")[1].trim()
                            })
                            // CSS_Viewer_color_regex(s.split(":")[1].trim(), e.target)
                        })
                    }
                })
            } catch (e) {
                console.warn("Warn : Uncaught exception.\nDetails :", e);
            };
        }
    } else {
        
    }
    return RS;
}

(() => {
    const StyleViewer = {
        target: document.body,
        selecting: false,
        filters: ["StyleViewer", []]
    };

    // 初始化
    StyleViewer.init = (target) => {
        if (target !== null) { StyleViewer.target = target; };
    }

    // 開始選擇元素
    StyleViewer.enterSelectingMode = () => {
        StyleViewer.selecting = true;
        var target = StyleViewer.target;
        target.addEventListener("mousemove", (e) => {

        });

        target.addEventListener("touchmove", (e) => {

        })
    }

    // 結束選擇元素
    StyleViewer.exitSelectingMode = () => {
        StyleViewer.selecting = false;
    }

    // 取得所有樣式
    StyleViewer.getAllStyle = (target) => {

    }

    // 取得使用者代理樣式表樣式
    StyleViewer.getDefaultStyle = (target) => {

    }

    // 取得陣列中的樣式
    StyleViewer.getStyleByArray = (target, style) => {

    }

    // 取得字串中的樣式 ( 以空格分開 )
    StyleViewer.getStyleByString = (target, style) => {

    }

    // 禁止 StyleViewer 對字串中的選擇器作用
    StyleViewer.filterByString = (selectors) => {

    }

    // 禁止 StyleViewer 對陣列中的選擇器作用
    StyleViewer.filterByArray = (selectors) => {

    }

    // 刪除過濾器
    StyleViewer.removeFilter = (filters) => {

    }

    // 關閉 / 開啟 StyleViewer
    StyleViewer.toggle = (s) => {

    }

    window.StyleViewer = StyleViewer;
})()