export default function formatLongURL(value, link = false) {
    if (link == true) {
        if (value.length <= 100) return value;
        return value.slice(0, 50) + "…" + value.slice(-49);
    }
    value = value.replace(/\".+\"/gi, (match, p1) => {
        return match.replace(/\"?\"/gi, '');
    });
    if (value.length <= 100) return `<a href="${value.toString()}" target="_blank" class="style-value-url-link" data-tippy-content="${value}">${value}</a>`;
    return `<a href="${value.toString()}" target="_blank" class="style-value-url-link" data-tippy-content="${value}">${value.slice(0, 50) + "…" + value.slice(-49)}</a>`;
}

