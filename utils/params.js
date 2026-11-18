// Query/body values can be arrays or objects: always turn them into plain strings
// before using them (also prevents NoSQL operator injection).
function str(value) {
    return typeof value === "string" ? value.trim() : "";
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { str, escapeRegex };
