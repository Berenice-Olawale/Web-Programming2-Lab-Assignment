const mongoose = require("mongoose");
const Notebook = require("../models/Notebook");
const Processor = require("../models/Processor");
const OpSystem = require("../models/OpSystem");
const setFlash = require("../utils/flash");
const { str } = require("../utils/params");

const EMPTY = { manufacturer: "", type: "", display: "", memory: "", harddisk: "", videocontroller: "", price: "", pieces: "0", processor: "", opsystem: "" };

function readForm(body) {
    const form = {};
    for (const key of Object.keys(EMPTY)) form[key] = str(body[key]);
    return form;
}

// Server-side validation: returns { errors, values } (values = converted for the model)
async function validate(form) {
    const errors = {};
    if (!form.manufacturer || form.manufacturer.length > 60) errors.manufacturer = "Brand is required (max 60 characters).";
    if (!form.type || form.type.length > 100) errors.type = "Model is required (max 100 characters).";

    const num = (key, label, min, integer) => {
        const n = Number(form[key]);
        if (form[key] === "" || !Number.isFinite(n) || n < min || (integer && !Number.isInteger(n))) {
            errors[key] = label + " must be " + (integer ? "a whole number" : "a number") + " (minimum " + min + ").";
        }
        return n;
    };
    const display = num("display", "Display size", 1, false);
    const memory = num("memory", "Memory", 1, true);
    const harddisk = num("harddisk", "Disk size", 1, true);
    const price = num("price", "Price", 0, true);
    const pieces = num("pieces", "Stock", 0, true);

    if (form.videocontroller.length > 100) errors.videocontroller = "Video controller is too long (max 100 characters).";

    if (!mongoose.isValidObjectId(form.processor) || !(await Processor.exists({ _id: form.processor }))) errors.processor = "Please choose a processor.";
    if (!mongoose.isValidObjectId(form.opsystem) || !(await OpSystem.exists({ _id: form.opsystem }))) errors.opsystem = "Please choose an operating system.";

    const values = {
        manufacturer: form.manufacturer, type: form.type, display, memory, harddisk,
        videocontroller: form.videocontroller, price, pieces,
        processor: form.processor, opsystem: form.opsystem
    };
    return { errors, values };
}

const lookups = async () => {
    const [processors, opsystems] = await Promise.all([
        Processor.find().sort({ manufacturer: 1, type: 1 }).lean(),
        OpSystem.find().sort({ name: 1 }).lean()
    ]);
    return { processors, opsystems };
};

const notFound = (res) => res.status(404).render("error", { title: "Not found", code: 404, message: "That notebook does not exist." });

// READ: list
exports.index = async (req, res) => {
    const items = await Notebook.find().sort({ manufacturer: 1, type: 1 }).populate("processor").populate("opsystem").lean();
    res.render("crud/index", { title: "CRUD", items });
};

// CREATE: form + save
exports.newForm = async (req, res) => {
    res.render("crud/form", { title: "New notebook", mode: "new", id: null, form: { ...EMPTY }, errors: {}, ...(await lookups()) });
};

exports.create = async (req, res) => {
    const form = readForm(req.body);
    const { errors, values } = await validate(form);
    if (Object.keys(errors).length > 0) {
        return res.status(400).render("crud/form", { title: "New notebook", mode: "new", id: null, form, errors, ...(await lookups()) });
    }
    await Notebook.create(values);
    setFlash(req, "success", "Notebook created.");
    res.redirect("/crud");
};

// UPDATE: form + save
exports.editForm = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const n = await Notebook.findById(req.params.id).lean();
    if (!n) return notFound(res);
    const form = {};
    for (const key of Object.keys(EMPTY)) form[key] = n[key] === undefined || n[key] === null ? "" : String(n[key]);
    res.render("crud/form", { title: "Edit notebook", mode: "edit", id: String(n._id), form, errors: {}, ...(await lookups()) });
};

exports.update = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    if (!(await Notebook.exists({ _id: req.params.id }))) return notFound(res);
    const form = readForm(req.body);
    const { errors, values } = await validate(form);
    if (Object.keys(errors).length > 0) {
        return res.status(400).render("crud/form", { title: "Edit notebook", mode: "edit", id: req.params.id, form, errors, ...(await lookups()) });
    }
    await Notebook.findByIdAndUpdate(req.params.id, values, { runValidators: true });
    setFlash(req, "success", "Notebook updated.");
    res.redirect("/crud");
};

// DELETE (POST form, with a confirm question in the browser)
exports.remove = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const deleted = await Notebook.findByIdAndDelete(req.params.id);
    if (!deleted) return notFound(res);
    setFlash(req, "success", "Notebook deleted.");
    res.redirect("/crud");
};