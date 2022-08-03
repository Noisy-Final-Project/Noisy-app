// const Model = require('../model/Model')
const fetcher = require('../model/fetching_queries')
const inserter = require('../model/insert_queries')
const {MongoConnection} = require('../model/mongoUtils')
const model = 
exports.getLocationsByRadius = async (req, res) => {
  const { latitude, logitude, radius } = req.query
  const minimal_distance = 1
  res.json(fetcher.findLocationByDist(MongoConnection, latitude, logitude,minimal_distance ,radius))
};

exports.getLocationReviews = async (req, res) => {
  const { lname, location, start, end} = req.query

  res.json(await fetcher.getReviews(MongoConnection,location,start,end))
};

exports.addReview = async (req, res) => {
  const { email, uid ,textReview, soundLevel, soundOpinion,
    labels, locationID, lname } = req.body
    // TODO what is better to transfer? userID (uid) or email? 
    // TODO location name is not nessecary if locationID can be transferred. is it possible for View to send it?
  res.json(inserter.insertReview(MongoConnection, uid,locationID,textReview,soundLevel,soundOpinion,labels))
};

