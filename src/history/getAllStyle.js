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

                        var replaceTemp = {};
                        var css_arr = css_content.replace(/url\((.*?)\)/gi, (match, p1) => {
                            var id = "sv_rd-ts." + new Date().getTime() + "hash." + Hash(96);
                            replaceTemp[id] = match;
                            return id;
                        }).split(";");
                        css_arr.pop();
                        css_arr.forEach(s => {
                            var val = s.slice(s.split(":")[0].length + 1).trim();
                            if (/sv_rd-ts\.[0-9]{13}hash\.[A-Za-z0-9]{96}/i.test(val)) {
                                val = val.replace(/sv_rd-ts\.[0-9]{13}hash\.[A-Za-z0-9]{96}/i, (match, p1) => {
                                    return valueURLFormat(replaceTemp[match], true);
                                })
                            }
                            RS[temp - 1].content.push({
                                name: s.split(":")[0].trim(),
                                value: val
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