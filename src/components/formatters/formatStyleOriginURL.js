export default function formatStyleOriginURL(org) {
    if (org.length <= 21) return org;
    return org.slice(0, 11) + "…" + org.slice(-9)
}