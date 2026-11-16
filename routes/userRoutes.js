const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.index);
router.get("/new", userController.newForm);
router.post("/insert", userController.insert);
router.get("/edit/:id", userController.editForm);
router.post("/update", userController.update);
router.post("/delete/:id", userController.remove);

module.exports = router;
