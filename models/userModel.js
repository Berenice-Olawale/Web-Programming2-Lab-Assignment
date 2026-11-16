const mongoose = require("mongoose");

// Server-side validation lives in the model: every field is mandatory
// and must be at least 3 characters long.
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: [true, "firstname is required!"],
        minlength: [3, "firstname must be at least 3 characters long!"]
    },
    lastname: {
        type: String,
        trim: true,
        required: [true, "lastname is required!"],
        minlength: [3, "lastname must be at least 3 characters long!"]
    },
    login: {
        type: String,
        trim: true,
        required: [true, "login is required!"],
        minlength: [3, "login must be at least 3 characters long!"]
    },
    password: {
        type: String,
        required: [true, "password is required!"],
        minlength: [3, "password must be at least 3 characters long!"]
    }
});

// Model "User" -> MongoDB collection "users" (database "web2")
module.exports = mongoose.model("User", userSchema);
