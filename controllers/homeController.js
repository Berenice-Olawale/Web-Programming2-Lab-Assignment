const Notebook = require("../models/Notebook");
const Processor = require("../models/Processor");
const OpSystem = require("../models/OpSystem");

exports.index = async (req, res) => {
    let stats = { notebooks: 0, processors: 0, opsystems: 0, pieces: 0, brands: 0 };
    let brands = [];
    let featured = [];
    let dbError = false;
    try {
        const [notebooks, processors, opsystems, piecesAgg, brandList, deals] = await Promise.all([
            Notebook.countDocuments(),
            Processor.countDocuments(),
            OpSystem.countDocuments(),
            Notebook.aggregate([{ $group: { _id: null, pieces: { $sum: "$pieces" } } }]),
            Notebook.distinct("manufacturer"),
            Notebook.find({ pieces: { $gt: 0 } }).sort({ price: 1 }).limit(3)
                .populate("processor").populate("opsystem").lean()
        ]);
        brands = brandList.sort();
        featured = deals;
        stats = {
            notebooks, processors, opsystems,
            pieces: piecesAgg.length ? piecesAgg[0].pieces : 0,
            brands: brands.length
        };
    } catch (err) {
        console.error("Home page data error:", err.message);
        dbError = true;
    }
    res.render("home", { title: "Mainpage", stats, brands, featured, dbError });
};
