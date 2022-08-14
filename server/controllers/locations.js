const fetcher = require("../model/fetching_queries");
const inserter = require("../model/insert_queries");

exports.getLocationsInBounds = async (req, res) => {
  const { bounds } = req.query;
  const jsonBounds = JSON.parse(bounds);
  res.set('Access-Control-Allow-Origin', '*');

  res.json(
    await fetcher.findLocationByRectangle(jsonBounds._sw, jsonBounds._ne)
  );
};

exports.getLocationReviews = async (req, res) => {
  const { id } = req.params.id;
  const page = req.query.page;

  res.set('Access-Control-Allow-Origin', '*');

  res.json(await fetcher.getReviews(id, page));
};

exports.addReview = async (req, res) => {
  const {
    userDetails,
    locationDetails,
    reviewDetails
  } = req.body;

  res.set('Access-Control-Allow-Origin', '*');

  res.json(
    await inserter.insertReview(
      locationDetails,
      userDetails,
      reviewDetails
    )
  );
};
