const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        match: /^[a-z0-9_]{3,30}$/
    },
    password: { type: String, required: true },          // bcrypt hash, never the plain password
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);   // collection: users
