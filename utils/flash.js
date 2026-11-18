// One-time message shown on the next page (type: success | info | warning | danger).
// app.js moves it into res.locals.flash, header.ejs prints it.
module.exports = function setFlash(req, type, text) {
    req.session.flash = { type, text };
};
