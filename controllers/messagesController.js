const Message = require("../models/Message");

// Newest message first
exports.index = async (req, res) => {
    const items = await Message.find().sort({ createdAt: -1 }).lean();
    res.render("messages", { title: "Messages", items });
};