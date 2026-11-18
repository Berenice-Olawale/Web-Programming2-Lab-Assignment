const router = require("express").Router();
const messages = require("../controllers/messagesController");
const { isLoggedIn } = require("../middleware/auth");

router.use(isLoggedIn);          // only logged in users (user + admin)
router.get("/", messages.index);

module.exports = router;
