require("dotenv").config();
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const { connectDB, getMongoUrl, getDbName } = require("./config/db");
const site = require("./config/site");

const app = express();
const port = process.env.PORT || 3000;     // Render provides PORT

app.set("trust proxy", 1);                 // Render is behind a proxy (needed for secure cookies)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
Object.assign(app.locals, require("./utils/format"));   // fmtPrice, fmtMemory ... for the views

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---- sessions (stored in MongoDB, so a restart does not log everybody out) ----
let secret = process.env.SESSION_SECRET;
if (!secret) {
    console.warn("SESSION_SECRET is not set - using a random one (everybody is logged out after a restart). Set it in .env / on Render.");
    secret = crypto.randomBytes(32).toString("hex");
}
const MongoStore = connectMongo.MongoStore || connectMongo.default || connectMongo;
const mongoUrl = getMongoUrl();
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    store: mongoUrl ? MongoStore.create({ mongoUrl, dbName: getDbName(), collectionName: "sessions" }) : undefined,
    cookie: { httpOnly: true, sameSite: "lax", secure: "auto", maxAge: 1000 * 60 * 60 * 24 }
}));

// ---- data for every view: logged in user, one-time message, site settings ----
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    res.locals.site = site;
    res.locals.currentPath = req.path;
    next();
});

app.use("/", require("./routes"));

// Error page that also works when the error happened before our own middleware ran
function errorPage(req, res, code, title, message) {
    res.status(code).render("error", {
        title, code, message,
        site,
        user: (req.session && req.session.user) || null,
        flash: null,
        currentPath: req.path || "/"
    });
}

app.use((req, res) => errorPage(req, res, 404, "Not found", "The page you are looking for does not exist."));

// Errors of async handlers (e.g. database not reachable) arrive here (Express 5)
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    errorPage(req, res, 500, "Error", "Something went wrong. Please try again in a moment.");
});

// A database problem must not crash the whole server
process.on("unhandledRejection", err => console.error("Unhandled rejection:", err && err.message ? err.message : err));

if (site.creators.some(c => /^X+$/i.test(c.neptun))) {
    console.warn("config/site.js still has placeholder Neptun codes - replace them before submitting!");
}

// Listen first (Render needs the open port quickly), connect to MongoDB in the background
app.listen(port, () => console.log("Server: http://localhost:" + port));
connectDB();
