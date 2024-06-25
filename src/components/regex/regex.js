const colorCodeRegex = /hsla?\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(,\s*0?\.?\d{1,2})?\)|(?:#)[0-9a-f]{8}|(?:#)[0-9a-f]{6}|(?:#)[0-9a-f]{4}|(?:#)[0-9a-f]{3}|(rgb|hsl)a?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*0?\.?\d*)?\)/gi;

const temp = /[0-9A-z-]*/g;

export {
    colorCodeRegex
}