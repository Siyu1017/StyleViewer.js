export default function formatSelector(selector, element) {
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