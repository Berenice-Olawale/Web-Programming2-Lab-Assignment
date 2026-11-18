// TODO (partner): Messages
// The route in routes/messages.js already applies the right access rule.
exports.index = (req, res) => {
    res.render("stub", {
        title: "Messages",
        access: "Logged in users (registered visitor and admin)",
        todo: [
            "List the messages saved by the Contact form, newest first (sort createdAt descending).",
            "Print the sending time on every message.",
            "Replace this placeholder view (views/stub.ejs) with views/messages.ejs."
        ]
    });
};
