const mongoose = require("mongoose");

// "Table" 1 of 3: processors
const processorSchema = new mongoose.Schema({
    legacyId: { type: Number, index: true },              // id in the original SQL notebook database
    manufacturer: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }
});

module.exports = mongoose.model("Processor", processorSchema);   // collection: processors
