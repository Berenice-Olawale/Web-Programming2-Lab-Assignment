const setFlash = require("../utils/flash");

// Roles:  visitor = not logged in,  user = registered visitor,  admin
// Logged in users (user + admin): Messages, Graph.   Admin only: CRUD.

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) return next();
    setFlash(req, "warning", "Please log in to see that page.");
    res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
    const u = req.session.user;
    if (!u) {
        setFlash(req, "warning", "Please log in to see that page.");
        return res.redirect("/login");
    }
    if (u.role === "admin") return next();
    setFlash(req, "danger", "That page is for administrators only.");
    res.redirect("/");
};

// Login / registration pages make no sense for somebody who is already logged in
exports.isGuest = (req, res, next) => {
    if (!req.session.user) return next();
    res.redirect("/");
};
