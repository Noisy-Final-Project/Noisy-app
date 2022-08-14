
const express = require('express');

// controllers
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyToken
} = require("../controllers/auth");

// const model = new Model()
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate", verifyToken);

module.exports = router;
