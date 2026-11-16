const User = require("../models/userModel");
const indexView = require("../views/index");
const newView = require("../views/new");
const editView = require("../views/edit");
const notFoundView = require("../views/notFound");

const FIELDS = ["firstname", "lastname", "login", "password"];

// Take only the expected fields from the form (always strings)
function pick(body) {
    const data = {};
    for (const f of FIELDS) {
        data[f] = body && typeof body[f] === "string" ? body[f] : "";
    }
    return data;
}

// An invalid id in the URL (CastError) is treated as "not found"
async function findUser(id) {
    try {
        return await User.findById(id);
    } catch (err) {
        if (err.name === "CastError") return null;
        throw err;
    }
}

function logValidation(err) {
    console.error("Validation error:");
    for (const field of Object.keys(err.errors)) {
        console.error(`  ${field}: ${err.errors[field].message}`);
    }
}

async function index(req, res) {
    const users = await User.find().sort({ lastname: 1, firstname: 1 });
    res.send(indexView(users));
}

function newForm(req, res) {
    res.send(newView({}, {}));
}

async function insert(req, res) {
    const data = pick(req.body);
    try {
        await User.create(data);
        res.redirect("/");
    } catch (err) {
        if (err.name === "ValidationError") {
            logValidation(err);
            return res.status(400).send(newView(data, err.errors));
        }
        throw err;
    }
}

async function editForm(req, res) {
    const user = await findUser(req.params.id);
    if (!user) return res.status(404).send(notFoundView());
    res.send(editView(user, {}));
}

// Practicing homework from the seminar: validation for the Edit form as well
async function update(req, res) {
    const user = await findUser(req.body.id);
    if (!user) return res.status(404).send(notFoundView());
    const data = pick(req.body);
    user.set(data);
    try {
        await user.save();
        res.redirect("/");
    } catch (err) {
        if (err.name === "ValidationError") {
            logValidation(err);
            // keep what the user typed, plus the _id for the hidden field
            return res.status(400).send(editView({ _id: user._id, ...data }, err.errors));
        }
        throw err;
    }
}

async function remove(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
    } catch (err) {
        if (err.name !== "CastError") throw err;
    }
    res.redirect("/");
}

module.exports = { index, newForm, insert, editForm, update, remove };
