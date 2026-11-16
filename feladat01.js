// Step 2 of the Render homework: a task WITH database (MongoDB Atlas).
// Reads the "users" collection of the "web2" database and lists the users.
// The connection string comes from the environment variable MONGODB_PASSW
// (.env locally, Environment Variables on Render) - never store it in Git!
// Render start command for this step:  node feladat01.js
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb"); // installed together with mongoose
const app = express();
const port = process.env.PORT || 8080;
const url = process.env.MONGODB_PASSW;
const client = new MongoClient(url || "mongodb://127.0.0.1:27017");

function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

app.get("/", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || "web2");
        const users = db.collection("users");
        const result = await users.find().toArray();
        let text = "<h2>Users</h2>";
        result.forEach(user => {
            text += escapeHtml(user.firstname) + " ";
            text += escapeHtml(user.lastname) + " ";
            text += escapeHtml(user.login) + "<br>";
        });
        res.send(text);
    } catch (err) {
        console.error(err);
        res.send("Database error!");
    }
});

app.listen(port, () => {
    console.log("Server PORT: " + port);
});
