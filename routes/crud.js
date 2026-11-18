const router = require("express").Router();
const crud = require("../controllers/crudController");
const { isAdmin } = require("../middleware/auth");

router.use(isAdmin);             // admin only
router.get("/", crud.index);

module.exports = router;
