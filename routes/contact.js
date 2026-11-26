const router = require("express").Router();
const contact = require("../controllers/contactController");

// Public: visitors can send messages too
router.get("/", contact.index);
router.post("/", contact.send);

module.exports = router;