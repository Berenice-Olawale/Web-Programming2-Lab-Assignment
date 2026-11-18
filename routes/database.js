const router = require("express").Router();
const db = require("../controllers/databaseController");

// Public: visitors can see the Database menu too
router.get("/", db.notebooks);
router.get("/processors", db.processors);
router.get("/operating-systems", db.opsystems);

module.exports = router;
