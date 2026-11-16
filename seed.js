// Optional: inserts the two test users from the homework into web2.users
// (same as "Add data / Insert document" on the Atlas website).
// Usage:  npm run seed      (needs the .env file with MONGODB_PASSW)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");

const testUsers = [
    { firstname: "Tibor", lastname: "Nagy", login: "nagyt", password: "1234" },
    { firstname: "Judit", lastname: "Kovacs", login: "kovacsj", password: "abcd" }
];

(async () => {
    const url = process.env.MONGODB_PASSW || process.env.MONGODB_URI;
    if (!url) {
        console.error("MONGODB_PASSW is not set (see .env.example).");
        process.exit(1);
    }
    try {
        await mongoose.connect(url, { dbName: process.env.DB_NAME || "web2" });
        for (const u of testUsers) {
            const result = await User.updateOne({ login: u.login }, { $setOnInsert: u }, { upsert: true });
            console.log(u.login + (result.upsertedCount ? ": inserted" : ": already exists"));
        }
    } catch (err) {
        console.error("Seed error:", err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
