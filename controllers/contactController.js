// TODO (partner): Contact
// The route in routes/contact.js already applies the right access rule.
exports.index = (req, res) => {
    res.render("stub", {
        title: "Contact",
        access: "Everybody (visitors too)",
        todo: [
            "Show a contact form (name, email, subject, message).",
            "Server-side validation; show the error messages next to the fields.",
            "Save the sent data to the database (new Mongoose model, e.g. models/Message.js, with a createdAt time).",
            "Replace this placeholder view (views/stub.ejs) with views/contact.ejs."
        ]
    });
};
