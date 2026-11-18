const router = require("express").Router();
const graph = require("../controllers/graphController");
const { isLoggedIn } = require("../middleware/auth");

router.use(isLoggedIn);          // only logged in users (user + admin)
router.get("/", graph.index);

module.exports = router;
