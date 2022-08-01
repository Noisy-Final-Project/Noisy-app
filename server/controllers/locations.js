const Model = require('../model/Model')
const model = 
exports.getLocationsByRadius = async (req, res) => {
  const { latitude, logitude, radius } = req.query

  res.json(model.getLocationsByRadius(latitude, longitude, radius))
};

exports.getLocationReviews = async (req, res) => {
  const { lname, location, start, end} = req.query

  res.json(model.getlocationreviews(lname, location, start, end))
};

exports.addReview = async (req, res) => {
  const { email, textReview, soundLevel, soundOpinion,
    labels, location, lname } = req.body

  res.json(model.insertReview(email, textReview, soundLevel, soundOpinion,
            labels, location, lname))
};

