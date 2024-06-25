"use strict";

function getDetail(target) {
    const computedStyle = window.getComputedStyle(target)

    const { left, top, width, height } = target.getBoundingClientRect()

    const getNumStyle = (name) => {
        function pxToNum(str) {
            return Number(str.replace('px', ''))
        }
        return pxToNum(computedStyle.getPropertyValue(name))
    }

    const ml = getNumStyle('margin-left')
    const mr = getNumStyle('margin-right')
    const mt = getNumStyle('margin-top')
    const mb = getNumStyle('margin-bottom')

    const bl = getNumStyle('border-left-width')
    const br = getNumStyle('border-right-width')
    const bt = getNumStyle('border-top-width')
    const bb = getNumStyle('border-bottom-width')

    const pl = getNumStyle('padding-left')
    const pr = getNumStyle('padding-right')
    const pt = getNumStyle('padding-top')
    const pb = getNumStyle('padding-bottom')

    const contentPath = {
        path: this.rectToPath({
            left: left + bl + pl,
            top: top + bt + pt,
            width: width - bl - pl - br - pr,
            height: height - bt - pt - bb - pb,
        }),
        name: 'content',
    }

    const paddingPath = {
        path: this.rectToPath({
            left: left + bl,
            top: top + bt,
            width: width - bl - br,
            height: height - bt - bb,
        }),
        name: 'padding',
    }

    const borderPath = {
        path: this.rectToPath({
            left,
            top,
            width,
            height,
        }),
        name: 'border',
    }

    const marginPath = {
        path: this.rectToPath({
            left: left - ml,
            top: top - mt,
            width: width + ml + mr,
            height: height + mt + mb,
        }),
        name: 'margin',
    }

    return [contentPath, paddingPath, borderPath, marginPath]
}

