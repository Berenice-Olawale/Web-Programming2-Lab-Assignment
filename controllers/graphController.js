// TODO (partner): Graph
// The route in routes/graph.js already applies the right access rule.
exports.index = (req, res) => {
    res.render("stub", {
        title: "Graph",
        access: "Logged in users (registered visitor and admin)",
        todo: [
            "Build a Chart.js graph (https://www.chartjs.org/) from database data, e.g. notebooks per manufacturer.",
            "Prepare the numbers in the controller (Notebook.aggregate) and pass them to the view.",
            "Replace this placeholder view (views/stub.ejs) with views/graph.ejs."
        ]
    });
};
