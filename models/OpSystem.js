const mongoose = require("mongoose");

// "Table" 2 of 3: operating systems
const opSystemSchema = new mongoose.Schema({
    legacyId: { type: Number, index: true },
    name: { type: String, required: true, trim: true }
});

module.exports = mongoose.model("OpSystem", opSystemSchema);     // collection: opsystems
