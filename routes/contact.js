const router = require("express").Router();
const contact = require("../controllers/contactController");

// Public. TODO (partner): add router.post("/", contact.send) with validation
router.get("/", contact.index);

module.exports = router;
