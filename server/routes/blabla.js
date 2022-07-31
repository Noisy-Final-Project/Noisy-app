
const express = require("express");

const router = express.Router();

// controllers
const {
 create, read, update, remove
} = "../controllers/blabla";


router.post("/create", create);
router.get("/read", read);
router.put("/update", update);
router.delete("/remove", remove);

module.exports = router;
