const mongoose = require("mongoose");

// The Atlas connection string is in the environment variable MONGODB_PASSW
// (MONGODB_URI / MONGO_URI are accepted as alternative names).
function getMongoUrl() {
    return process.env.MONGODB_PASSW || process.env.MONGODB_URI || process.env.MONGO_URI;
}

// The Atlas string normally has no database name, so we choose it here.
function getDbName() {
    return process.env.DB_NAME || "renew";
}

async function connectDB() {
    const url = getMongoUrl();
    if (!url) {
        console.error("MONGODB_PASSW is not set. Create a .env file locally, or add the environment variable on Render.");
        return false;
    }
    try {
        await mongoose.connect(url, { dbName: getDbName() });
        console.log("MongoDB is connected (database: " + getDbName() + ").");
        return true;
    } catch (err) {
        console.error("MongoDB error:", err.message);
        return false;
    }
}

module.exports = { connectDB, getMongoUrl, getDbName };
