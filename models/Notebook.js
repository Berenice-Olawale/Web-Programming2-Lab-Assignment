const mongoose = require("mongoose");
require("./Processor");   // make sure the referenced models are registered (needed by populate)
require("./OpSystem");

// "Table" 3 of 3: notebooks. It references the other two (like foreign keys in SQL).
const notebookSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    display: { type: Number, required: true },              // inch
    memory: { type: Number, required: true },               // MB
    harddisk: { type: Number, required: true },             // GB
    videocontroller: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    pieces: { type: Number, required: true, min: 0, default: 0 },   // pieces in stock
    processor: { type: mongoose.Schema.Types.ObjectId, ref: "Processor", required: true },
    opsystem: { type: mongoose.Schema.Types.ObjectId, ref: "OpSystem", required: true }
});

module.exports = mongoose.model("Notebook", notebookSchema);     // collection: notebooks
