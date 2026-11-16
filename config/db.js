const mongoose = require("mongoose");

// The homework uses the environment variable MONGODB_PASSW for the Atlas
// connection string (MONGODB_URI is accepted as an alternative name).
function getConnectionString() {
    return process.env.MONGODB_PASSW || process.env.MONGODB_URI;
}

async function connectDB() {
    const url = getConnectionString();
    if (!url) {
        console.error("MONGODB_PASSW is not set. Create a .env file locally, or add the environment variable on Render.");
        return false;
    }
    try {
        // The Atlas connection string usually has no database name in it,
        // so we choose it here: database "web2", collection "users".
        await mongoose.connect(url, { dbName: process.env.DB_NAME || "web2" });
        console.log("Database connected");
        return true;
    } catch (err) {
        console.error("Database connection error:", err.message);
        return false;
    }
}

module.exports = connectDB;
