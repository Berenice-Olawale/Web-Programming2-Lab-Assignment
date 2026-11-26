const mongoose = require("mongoose");

// Messages sent with the Contact form (shown in the Messages menu)
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 }
}, { timestamps: true });      // createdAt = sending time

module.exports = mongoose.model("Message", messageSchema);   // collection: messages