export default function removeHTMLTag(content) {
    return content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
