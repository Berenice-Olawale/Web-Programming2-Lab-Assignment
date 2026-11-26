const Message = require("../models/Message");
const setFlash = require("../utils/flash");
const { str } = require("../utils/params");

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form) {
    const errors = {};
    if (form.name.length < 2 || form.name.length > 80) errors.name = "Please enter your name (2-80 characters).";
    if (!EMAIL_RX.test(form.email) || form.email.length > 120) errors.email = "Please enter a valid email address.";
    if (form.subject.length < 3 || form.subject.length > 120) errors.subject = "The subject must be 3-120 characters long.";
    if (form.message.length < 10 || form.message.length > 2000) errors.message = "The message must be 10-2000 characters long.";
    return errors;
}

exports.index = (req, res) => {
    res.render("contact", { title: "Contact", form: { name: "", email: "", subject: "", message: "" }, errors: {} });
};

exports.send = async (req, res) => {
    const form = {
        name: str(req.body.name),
        email: str(req.body.email),
        subject: str(req.body.subject),
        message: str(req.body.message)
    };
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
        return res.status(400).render("contact", { title: "Contact", form, errors });
    }
    await Message.create(form);
    setFlash(req, "success", "Thank you! Your message has been sent.");
    res.redirect("/contact");
};