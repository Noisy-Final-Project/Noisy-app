
const express = require("express");

const router = express.Router();

// controllers
const {
    addReview, getLocationsByRadius, getLocationReviews
} = "../controllers/locations";

router.post("/add-review", addReview);
router.get("/", getLocationsByRadius);
router.get("/reviews/", getLocationReviews);

module.exports = router;
