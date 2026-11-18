const router = require("express").Router();
const auth = require("../controllers/authController");
const { isGuest } = require("../middleware/auth");

router.get("/register", isGuest, auth.registerGet);
router.post("/register", isGuest, auth.registerPost);
router.get("/login", isGuest, auth.loginGet);
router.post("/login", isGuest, auth.loginPost);
router.post("/logout", auth.logout);

module.exports = router;
