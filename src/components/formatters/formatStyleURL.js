import isElement from "../verifier/isElement";
import formatStyleOriginURL from "./formatStyleOriginURL";

export default function formatStyleURL(ownerNode) {
    if (isElement(ownerNode) == true) {
        var origin = ownerNode.getAttribute("href") ? formatStyleOriginURL(ownerNode.getAttribute("href").substring(ownerNode.getAttribute("href").lastIndexOf('/') + 1)) : `&lt;${ownerNode.nodeName.toLowerCase()}&gt;`;
        return `<${ownerNode.getAttribute("href") ? "a target='_blank' href='" + ownerNode.getAttribute("href") + "'" : "span"} style='color: ${ownerNode.getAttribute("href") ? "auto" : "rgb(175 170 170)"};float: right;margin-left: 15px;text-wrap: nowrap;height: 15px;margin-bottom: -1px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;direction: rtl;text-align: left;'>${origin}</${ownerNode.getAttribute("href") ? "a" : "span"}>`;
    } else {
        return '';
    }

}