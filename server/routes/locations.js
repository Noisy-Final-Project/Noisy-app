
const express = require("express");

const router = express.Router();

// controllers
const {
    addReview, getLocationsInBounds, getLocationReviews
} = require("../controllers/locations");

router.post("/add-review", addReview);
router.get("/", getLocationsInBounds);
router.get("/reviews/:id", getLocationReviews);

module.exports = router;
