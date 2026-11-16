// Step 1 of the Render homework: a task WITHOUT database (Hello Express World).
// Render start command for this step:  node feladat001.js
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    console.log(req.url);
    res.send("Hello Express World!\n");
});

app.listen(port, () => {
    console.log("The server has started on port " + port + ".");
});
