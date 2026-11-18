const router = require("express").Router();

router.use("/", require("./home"));
router.use("/", require("./auth"));
router.use("/database", require("./database"));
router.use("/contact", require("./contact"));
router.use("/messages", require("./messages"));
router.use("/graph", require("./graph"));
router.use("/crud", require("./crud"));

module.exports = router;
