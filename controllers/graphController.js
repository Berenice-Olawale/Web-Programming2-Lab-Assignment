const Notebook = require("../models/Notebook");

// Numbers for the Chart.js graphs are prepared here with aggregate pipelines
exports.index = async (req, res) => {
    const [perBrand, priceByBrand] = await Promise.all([
        Notebook.aggregate([
            { $group: { _id: "$manufacturer", count: { $sum: 1 }, stock: { $sum: "$pieces" } } },
            { $sort: { count: -1, _id: 1 } }
        ]),
        Notebook.aggregate([
            { $group: { _id: "$manufacturer", avgPrice: { $avg: "$price" } } },
            { $sort: { avgPrice: -1 } }
        ])
    ]);
    const data = {
        count: { labels: perBrand.map(r => r._id), values: perBrand.map(r => r.count) },
        stock: { labels: perBrand.map(r => r._id), values: perBrand.map(r => r.stock) },
        price: { labels: priceByBrand.map(r => r._id), values: priceByBrand.map(r => Math.round(r.avgPrice)) }
    };
    // "<" is escaped so the JSON can never close the <script> tag in the view
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    res.render("graph", { title: "Graph", json, hasData: perBrand.length > 0 });
};