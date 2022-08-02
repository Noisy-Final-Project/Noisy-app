/**
 * This file will contain different queries from the DB server
 * that will insert data
 * */

const db_name = "Noisy";
// var { MongoUtils: MU } = require("./mongoUtils");
var {
  emailExists,
  getLocation,
  findLocationByDist,
} = require("./fetching_queries");
/**
 * The insertUser function inserts a new user into the database.
 * TODO Is DOB nessecary? In which format it will be given?
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
      name: _name.trim().split(/\s+/),
      dob: _dob.split("/"),
      Email: _email,
      password: _hash,
    };
    try {
      let p = await MC.db(db_name).collection("users").insertOne(doc);
      return { "res": true, "userID": p.insertedId, "err": "" };
    } catch (err) {
      return { "res": false, "err": "User not in DB, but failed to add it" };
    }
  } else if (alreadyInDB == true) {
    // email is in DB
    return { "res": false, "err": "User in DB" };
  } else {
    // Other problem
    return { "res": false, "err": "Connection error" };
  }
}

/**
 * The insertLocation function inserts a new location into the database.
 *
 *
 * @param MC Used to Connect to the mongodb database.
 * @param _name Used to Name the location.
 * @param latitude Used to Find the location in the database.
 * @param longtitude Used to Find the location in the database.
 * @param _city city of a location.
 * @param _street street of the location in the database.
 * @param _num Used to Specify the street number of the location.
 * @param _category Used to Specify the category of the location.
 * @return A promise that resolves to either a success message or an error message.
 *
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
  _category
) {
  //TODO check if the location exists. check if there are businesses within a certain radius
  let successful;
  let errMsg;
  let locationID;
  let nearbyLoc = await findLocationByDist(MC, latitude, longtitude, 0, 50);

  if (nearbyLoc.length != 0) {
    for (let i = 0; i < nearbyLoc; i++) {
      if (nearbyLoc[i].name == _name) {
        //TODO needs testing
        successful = false;
        errMsg = "location within 50 meters exists with this name";
      }
    }
  } else {
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
        })
        .catch((err) => {
          successful = false;
          locationID = p.insertedId;
          errMsg = err;
        });
    } catch (errors) {}
  }
  return { "status": successful, "locationId": locationID, "message": errMsg };
}

/**
 * The insertReview function inserts a new review into the database.
 * //TODO needs to be tested
 *
 * @param MC Used to Access the mongoclient object.
 * @param uid Used to Identify the user who is posting the review.
 * @param lid Used to Identify the location of the review.
 * @param ut Used to Determine the user text review.
 * @param usv Used to Store the value that represents user's recording of the sound.
 * @param uso Used to store the user sound opinion
 * @param labels {array} Used to Store the labels of the review.
 * @return A boolean value. True if added successfuly, otherwise false
 *
 *
 */
async function insertReview(MC, _uid, _lid, _ut, _usv, _uso, _labels) {
  let success = false;

  // Check if location ID already exists in the database.
  if (getLocation(MC, _lid) != false) {
    // Location already exists in the database (checked by location ID)

    let reviewDocument = {
      uid: _uid,
      lid: _lid,
      userText: _ut,
      objectiveSound: _usv,
      userSoundOpinion: _uso,
      labels: _labels,
      createdOn: new Date(),
    };
    try {
      let DB = await MC.db(db_name);
      let locations = await DB.collection("reviews");
      let Q = await locations.insertOne(reviewDocument).then(() => {
        success = true;
      });
    } catch (err) {
      // Do something
    }
  } else {
    // _lid is not a location id in the database
    // TODO what to do about this? Should a new location be created?
  }
  return success;
}

module.exports = { insertUser, insertLocation, insertReview };
