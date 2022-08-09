/**
 * This file will contain different queries from the DB server
 * that will insert data
 * */

const db_name = "Noisy";
var { emailExists, getLocation } = require("./fetching_queries");
/**
 * The insertUser function inserts a new user into the database.
 *
 * @param MC Used to Connect to the mongodb database.
 * @param name Used to Create a new user.
 * @param dob Used to Store the date of birth.
 * @param email Used to Check if the user already exists in the database.
 * @return JSON - with {res,userID,err} . res is true  and userID is it's unique ID if user was added, otherwise false and no user ID.
 *
 *
 */
async function insertUser(MC, _name, _dob, _email, _hash) {
  var alreadyInDB = await emailExists(MC, _email);
  if (alreadyInDB == false) {
    const doc = {
      name: _name,
      dob: _dob,
      Email: _email,
      password: _hash,
    };
    try {
      let p = await MC.db(db_name).collection("users").insertOne(doc);
      return { res: true, userID: p.insertedId, err: "" };
    } catch (err) {
      return { res: false, err: "User not in DB, but failed to add it" };
    }
  } else if (alreadyInDB == true) {
    // email is in DB
    return { res: false, err: "User in DB" };
  } else {
    // Other problem
    return { res: false, err: "Connection error" };
  }
}

/**
 * The insertLocation function inserts a new location into the database.
 *
 *
 * @param MC Used to Connect to the database.
 * @param _name Used to Store the name of the location.
 * @param latitude
 * @param longtitude
 * @param _category Optional.
 * @param _TID location id of the location in tomtom.
 * @return A json.
 *
 */
async function insertLocation(
  MC,
  _name,
  latitude,
  longtitude,
  _city,
  _street,
  _num,
  _category,
  _TID
) {
  let successful;
  let errMsg;
  let locationID;

  let tidQuery = await MC.db(db_name)
    .collection("locations")
    .findOne({ tid: _TID });
  if (tidQuery) {
    return {
      status: false,
      message: "Tomtom ID already exists in the database",
    };
  }

  let geoObject = { type: "Point", coordinates: [longtitude, latitude] };
  let document = {
    name: _name,
    location: geoObject,
    area: [_city, _street, _num],
    category: _category,
    created_on: new Date(),
  };

  try {
    let p = await MC.db(db_name)
      .collection("locations")
      .insertOne(document)
      .then(() => {
        successful = true;
        // that is the ObjectID given to the location by mongoDB.
        locationID = p.insertedId.toString();
      })
      .catch((err) => {
        successful = false;
        errMsg = err;
      });
  } catch (errors) {}

  return { status: successful, locationId: locationID, message: errMsg };
}

/**
 * The insertReview function inserts a review into the database.
 *
 *
 * @param MC Used to Access the database.
 * @param _uid Used to Identify the user who is submitting a review.
 * @param _tid Used to Find the location in the , tomtom ID for the location.
 * @param _ut Used to Store the user text.
 * @param _usv Used to Store the user's objective value of the sound.
 * @param _uso Used to Store the user's sound opinion.
 * @param _labels Used to Store the labels that were selected by the user for the location.
 * @return true if review inserted succesfully, otherwise false.
 *
 */
async function insertReview(MC, _uid, _tid, _ut, _usv, _uso, _labels) {
  // Check if location ID already exists in the database.
  const findPOI = await MC.db(db_name)
    .collection("locations")
    .findOne({ tid: _tid });

  if (findPOI) {
    // Location already exists in the database (checked by tomtom ID)

    let reviewDocument = {
      uid: _uid,
      tid: _tid,
      userText: _ut,
      objectiveSound: _usv,
      userSoundOpinion: _uso,
      labels: _labels,
      createdOn: new Date(),
    };
    try {
      let DB = await MC.db(db_name);
      let reviews = await DB.collection("reviews");
      let Q = await reviews.insertOne(reviewDocument).then(() => {
        return true;
      });
    } catch (err) {
      // some error with the database connection?
      return false;
    }
  }
  // couldn't find the location in the database (based on tomtom ID)
  return false;
}

module.exports = { insertUser, insertLocation, insertReview };
