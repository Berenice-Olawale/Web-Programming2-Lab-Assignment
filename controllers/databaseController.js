const mongoose = require("mongoose");
const Notebook = require("../models/Notebook");
const Processor = require("../models/Processor");
const OpSystem = require("../models/OpSystem");
const { str, escapeRegex } = require("../utils/params");

const PAGE_SIZE = 20;
const SORTS = {
    brand: { manufacturer: 1, type: 1 },
    price_asc: { price: 1, manufacturer: 1 },
    price_desc: { price: -1, manufacturer: 1 },
    memory_desc: { memory: -1, price: 1 }
};

// Notebooks (joined with processors and operating systems through populate)
exports.notebooks = async (req, res) => {
    const filters = {
        q: str(req.query.q),
        manufacturer: str(req.query.manufacturer),
        processor: str(req.query.processor),
        os: str(req.query.os),
        maxPrice: str(req.query.maxPrice),
        stock: str(req.query.stock) === "1" ? "1" : "",
        sort: SORTS[str(req.query.sort)] ? str(req.query.sort) : "brand"
    };

    const query = {};
    if (filters.q) {
        const rx = new RegExp(escapeRegex(filters.q), "i");
        query.$or = [{ manufacturer: rx }, { type: rx }, { videocontroller: rx }];
    }
    if (filters.manufacturer) query.manufacturer = filters.manufacturer;
    if (mongoose.isValidObjectId(filters.processor)) query.processor = filters.processor;
    if (mongoose.isValidObjectId(filters.os)) query.opsystem = filters.os;
    const maxPrice = Number(filters.maxPrice);
    if (filters.maxPrice && Number.isFinite(maxPrice) && maxPrice > 0) query.price = { $lte: maxPrice };
    if (filters.stock) query.pieces = { $gt: 0 };

    const total = await Notebook.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(totalPages, Math.max(1, parseInt(str(req.query.page), 10) || 1));

    const [items, manufacturers, processors, opsystems] = await Promise.all([
        Notebook.find(query).sort(SORTS[filters.sort]).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE)
            .populate("processor").populate("opsystem").lean(),
        Notebook.distinct("manufacturer"),
        Processor.find().sort({ manufacturer: 1, type: 1 }).lean(),
        OpSystem.find().sort({ name: 1 }).lean()
    ]);

    // links that keep the active filters while changing the page
    const active = {};
    for (const key of Object.keys(filters)) {
        if (filters[key] && !(key === "sort" && filters.sort === "brand")) active[key] = filters[key];
    }
    const pageUrl = n => {
        const p = new URLSearchParams(active);
        if (n > 1) p.set("page", String(n));
        const s = p.toString();
        return "/database" + (s ? "?" + s : "");
    };

    res.render("database/notebooks", {
        title: "Database", tab: "notebooks",
        items, total, page, totalPages, pageSize: PAGE_SIZE, pageUrl, filters,
        manufacturers: manufacturers.sort(), processors, opsystems,
        hasFilters: Object.keys(active).length > 0
    });
};

// Processors + how many notebooks use each of them
exports.processors = async (req, res) => {
    const [processors, counts] = await Promise.all([
        Processor.find().sort({ manufacturer: 1, type: 1 }).lean(),
        Notebook.aggregate([{ $group: { _id: "$processor", count: { $sum: 1 } } }])
    ]);
    const byId = new Map(counts.map(c => [String(c._id), c.count]));
    const rows = processors.map(p => ({ ...p, count: byId.get(String(p._id)) || 0 }));
    res.render("database/processors", { title: "Database: processors", tab: "processors", rows });
};

// Operating systems + how many notebooks use each of them
exports.opsystems = async (req, res) => {
    const [systems, counts] = await Promise.all([
        OpSystem.find().sort({ name: 1 }).lean(),
        Notebook.aggregate([{ $group: { _id: "$opsystem", count: { $sum: 1 } } }])
    ]);
    const byId = new Map(counts.map(c => [String(c._id), c.count]));
    const rows = systems.map(s => ({ ...s, count: byId.get(String(s._id)) || 0 }));
    res.render("database/opsystems", { title: "Database: operating systems", tab: "opsystems", rows });
};
