// Loads the ReNew notebook data into MongoDB and creates the admin account.
//   npm run seed             -> fills empty collections, creates the admin (needs ADMIN_PASSWORD in .env)
//   npm run seed -- --reset  -> deletes processors / opsystems / notebooks first, then loads them again
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { getMongoUrl, getDbName } = require("./config/db");
const User = require("./models/User");
const Processor = require("./models/Processor");
const OpSystem = require("./models/OpSystem");
const Notebook = require("./models/Notebook");
const data = require("./seed/data.json");

async function loadNotebookData(reset) {
    if (reset) {
        await Promise.all([Notebook.deleteMany({}), Processor.deleteMany({}), OpSystem.deleteMany({})]);
        console.log("Old processors / operating systems / notebooks removed.");
    }
    const existing = await Promise.all([Processor.countDocuments(), OpSystem.countDocuments(), Notebook.countDocuments()]);
    if (existing.some(n => n > 0)) {
        console.log("Notebook data already present - skipped (use  npm run seed -- --reset  to load it again).");
        return;
    }
    const processors = await Processor.insertMany(data.processors);
    const opsystems = await OpSystem.insertMany(data.opsystems);
    const processorIds = new Map(processors.map(p => [p.legacyId, p._id]));
    const opsystemIds = new Map(opsystems.map(o => [o.legacyId, o._id]));

    const notebooks = data.notebooks.map(n => ({
        manufacturer: n.manufacturer, type: n.type, display: n.display, memory: n.memory,
        harddisk: n.harddisk, videocontroller: n.videocontroller, price: n.price, pieces: n.pieces,
        processor: processorIds.get(n.processorId),
        opsystem: opsystemIds.get(n.opsystemId)
    }));
    await Notebook.insertMany(notebooks);
    console.log(`Loaded ${processors.length} processors, ${opsystems.length} operating systems, ${notebooks.length} notebooks.`);
}

async function createAdmin() {
    const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 6) {
        console.log("ADMIN_PASSWORD is missing or shorter than 6 characters in .env - admin account NOT created.");
        return;
    }
    const existing = await User.findOne({ username });
    if (existing) {
        if (existing.role !== "admin") {
            existing.role = "admin";
            await existing.save();
            console.log(`User "${username}" already existed and is now an admin.`);
        } else {
            console.log(`Admin "${username}" already exists (password unchanged).`);
        }
        return;
    }
    await User.create({ username, password: await bcrypt.hash(password, 10), role: "admin" });
    console.log(`Admin account created: username "${username}".`);
}

(async () => {
    const url = getMongoUrl();
    if (!url) {
        console.error("MONGODB_PASSW is not set (see .env.example).");
        process.exit(1);
    }
    try {
        await mongoose.connect(url, { dbName: getDbName() });
        await loadNotebookData(process.argv.includes("--reset"));
        await createAdmin();
    } catch (err) {
        console.error("Seed error:", err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
