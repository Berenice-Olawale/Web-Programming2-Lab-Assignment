// Full homework app: Express + Mongoose, MVC model, MongoDB Atlas, deployed on Render.
// Start locally:  npm start      Render start command:  npm start
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const layout = require("./views/layout");
const notFoundView = require("./views/notFound");

const app = express();
// Render provides the port in the PORT environment variable (locally we use 8080)
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

// Simple check that the server is alive (no database needed)
app.get("/health", (req, res) => res.send("OK"));

app.use("/", userRoutes);

app.use((req, res) => res.status(404).send(notFoundView()));

// Errors from async handlers (e.g. database not reachable) end up here (Express 5)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(layout("Error", `<h2>Database error!</h2>
  <p>Something went wrong. Check the MongoDB Atlas settings: the connection string
  and Network Access (IP list).</p>`));
});

// Start listening right away, so Render sees the open port quickly;
// the database connection is established in the background.
app.listen(port, () => {
    console.log("Server PORT: " + port);
});
connectDB();
