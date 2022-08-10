const fetcher = require("../model/fetching_queries");
const inserter = require("../model/insert_queries");

exports.getLocationsInBounds = async (req, res) => {
  const { bounds } = req.query;
  const jsonBounds = JSON.parse(bounds);

  res.json(
    await fetcher.findLocationByRectangle(jsonBounds._sw, jsonBounds._ne)
  );
};

exports.getLocationReviews = async (req, res) => {
  const { id } = req.params.id;
  const page = req.query.page;
  res.json(await fetcher.getReviews(id, page));
};

exports.addReview = async (req, res) => {
  const {
    uid,
    textReview,
    soundLevel,
    soundOpinion,
    labels,
    locationID,
    additionalDetails,
  } = req.body;
  res.json(
    await inserter.insertReview(
      locationID,
      uid,
      textReview,
      soundLevel,
      soundOpinion,
      labels,
      additionalDetails
    )
  );
};
