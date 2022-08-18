
const express = require('express');

// Auth controllers:
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyToken
} = require("../controllers/auth");

// Using express router for http requests routing
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate", verifyToken);

module.exports = router;
