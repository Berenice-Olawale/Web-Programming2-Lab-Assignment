const router = require("express").Router();
const crud = require("../controllers/crudController");
const { isAdmin } = require("../middleware/auth");

router.use(isAdmin);             // admin only

router.get("/", crud.index);                    // Read (list)
router.get("/new", crud.newForm);               // Create: form  (must come before "/:id")
router.post("/", crud.create);                  // Create: save
router.get("/:id/edit", crud.editForm);         // Update: form
router.post("/:id", crud.update);               // Update: save
router.post("/:id/delete", crud.remove);        // Delete

module.exports = router;