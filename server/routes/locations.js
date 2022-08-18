
const express = require("express");

const router = express.Router();

// Location Controllers
const {
    addReview, getLocationsInBounds, getLocationReviews, getLabels
} = require("../controllers/locations");

router.post("/add-review", addReview);
router.get("/", getLocationsInBounds);
router.get("/reviews/:id", getLocationReviews);
router.get("/get-labels", getLabels)

module.exports = router;
