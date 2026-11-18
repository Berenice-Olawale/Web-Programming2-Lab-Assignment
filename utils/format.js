const site = require("../config/site");

exports.fmtPrice = n => Number(n).toLocaleString("hu-HU") + " " + site.currency;
exports.fmtMemory = mb => (mb >= 1024 ? (mb / 1024) + " GB" : mb + " MB");
exports.fmtDisk = gb => (gb >= 1000 ? (gb / 1000) + " TB" : gb + " GB");
exports.fmtDisplay = inch => Number(inch).toFixed(1) + "\"";
