const bcrypt = require("bcryptjs");
const User = require("../models/User");
const setFlash = require("../utils/flash");
const { str } = require("../utils/params");

// Used when the username does not exist, so a wrong username takes as long as a wrong password
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

exports.registerGet = (req, res) => {
    res.render("register", { title: "Registration", errors: [], form: { username: "" } });
};

exports.registerPost = async (req, res) => {
    const body = req.body || {};
    const username = str(body.username).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const confirm = typeof body.confirm === "string" ? body.confirm : "";

    const errors = [];
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
        errors.push("The username must be 3-30 characters long: letters, numbers and underscore only.");
    }
    if (password.length < 6 || password.length > 72) {
        errors.push("The password must be 6-72 characters long.");
    }
    if (password !== confirm) {
        errors.push("The two passwords are not the same.");
    }
    if (errors.length === 0 && await User.exists({ username })) {
        errors.push("There is already such a user!");
    }
    if (errors.length) {
        return res.status(400).render("register", { title: "Registration", errors, form: { username } });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, password: hash, role: "user" });
    } catch (err) {
        if (err.code === 11000) {   // two people registered the same name at the same moment
            return res.status(400).render("register", {
                title: "Registration", errors: ["There is already such a user!"], form: { username }
            });
        }
        throw err;
    }
    setFlash(req, "success", "Successful registration! You can log in now.");
    res.redirect("/login");
};

exports.loginGet = (req, res) => {
    res.render("login", { title: "Login", error: "", form: { username: "" } });
};

exports.loginPost = async (req, res, next) => {
    const body = req.body || {};
    const username = str(body.username).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";

    const user = username ? await User.findOne({ username }) : null;
    const ok = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
    if (!user || !ok) {
        return res.status(401).render("login", { title: "Login", error: "Login failed!", form: { username } });
    }

    // New session id after login (protects against session fixation)
    req.session.regenerate(err => {
        if (err) return next(err);
        req.session.user = { id: String(user._id), username: user.username, role: user.role };
        setFlash(req, "success", "Welcome, " + user.username + "!");
        req.session.save(err2 => {
            if (err2) return next(err2);
            res.redirect("/");
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
};
