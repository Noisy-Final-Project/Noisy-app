
const express = require('express');


// controllers
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

// const model = new Model()
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    data: "Testing",
  });
});
router.post("/signup", signUp);
router.post("/signin", signIn);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;
