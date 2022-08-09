const fetcher = require('../model/fetching_queries')
const inserter = require('../model/insert_queries')

exports.getLocationsInBounds = async (req, res) => {
  const { bounds } = req.query
  const jsonBounds = JSON.parse(bounds)

  res.json(await fetcher.getLocationsInBounds(jsonBounds._sw, jsonBounds._ne))
};

exports.getLocationReviews = async (req, res) => {
  const { id } = req.params.id

  res.json(await fetcher.getReviews(id))
};

exports.addReview = async (req, res) => {
  const { email, uid ,textReview, soundLevel, soundOpinion,
    labels, locationID, lname } = req.body
    // TODO what is better to transfer? userID (uid) or email? 
    // TODO location name is not nessecary if locationID can be transferred. is it possible for View to send it?
  res.json(inserter.insertReview(uid,locationID,textReview,soundLevel,soundOpinion,labels))
};

