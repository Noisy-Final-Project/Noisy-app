const fetcher = require("../model/fetching_queries");
const inserter = require("../model/insert_queries");

exports.getLocationsInBounds = async (req, res) => {
  const { bounds, labels } = req.query;
  const jsonBounds = JSON.parse(bounds);

  const labelsArray = labels.split(',')
  const labelsToSend = (labelsArray[0] == "") ? [] : labelsArray

  res.set('Access-Control-Allow-Origin', '*');

  const answer = await fetcher.findLocationByRectangle(jsonBounds._sw, jsonBounds._ne, labelsToSend)
  res.json(
    answer
  );
};

exports.getLocationReviews = async (req, res) => {
  const id = req.params.id;
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
      reviewDetails,
      locationDetails,
      userDetails,
    )
  );
};

exports.getLabels = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  res.json({
    labels: [
      'Music',
      'Business Meetings',
      'Dates',
      'Party',
      'Conversation',
      'Families',
      'Friends Hangout',
      'Children'
    ]   
});
};
