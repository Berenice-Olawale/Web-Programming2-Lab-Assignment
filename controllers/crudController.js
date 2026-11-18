// TODO (partner): CRUD
// The route in routes/crud.js already applies the right access rule.
exports.index = (req, res) => {
    res.render("stub", {
        title: "CRUD",
        access: "Admin only",
        todo: [
            "CRUD (Create, Read, Update, Delete) for one collection, e.g. notebooks (models/Notebook.js exists).",
            "Use POST forms for create / update / delete, with server-side validation.",
            "Replace this placeholder view (views/stub.ejs) with your own views."
        ]
    });
};
