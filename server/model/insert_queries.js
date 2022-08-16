/**
 * This file will contain different queries from the DB server
 * that will insert data
 * */

const db_name = "Noisy";
var {
  emailExists,
  getLocation,
  findLocationByDist,
} = require("./fetching_queries");
const { MongoConnection } = require("./mongoUtils");
const { ObjectId } = require("mongodb");
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
async function insertUser(_name, _dob, _email, _hash, MC = MongoConnection) {
  var alreadyInDB = await emailExists(_email);

  if (alreadyInDB.status == false) {
    const doc = {
      name: _name,
      dob: _dob,
      Email: _email,
      password: _hash,
    };
    try {
      let p = await MC.db(db_name).collection("users").insertOne(doc);
      return { res: true, userID: p.insertedId, error: "" };
    } catch (err) {
      return { res: false, error: "User not in DB, but failed to add it" };
    }
  } else if (alreadyInDB.status == true) {
    // email is in DB
    return { res: false, userID: alreadyInDB.userID };
  } else {
    // Other problem
    return { res: false, error: alreadyInDB.err };
  }
}

async function insertLocation(
  _name,
  latitude,
  longtitude,
  totomAddress,
  _category,
  MC = MongoConnection
) {
  let successful;
  let errMsg;
  let locationID;

  // Check if the location already exists in the database
  const maxDistance = 100;
  const locationNearby = await findLocationByDist(
    latitude,
    longtitude,
    0,
    maxDistance
  );

  for await (const doc of locationNearby) {
    if (doc.name == _name) {
      // location already exists in the database
      return {
        status: false,
        message: "location already exists in the database",
        locationID: doc._id.toString(),
      };
    }
  }

  let geoObject = { type: "Point", coordinates: [longtitude, latitude] };
  let document = {
    name: _name,
    location: geoObject,
    address: `${totomAddress.freeformAddress},`,
    category: _category,
    created_on: new Date(),
  };

  try {
    let p = await MC.db(db_name).collection("locations").insertOne(document);
    successful = true;
    // that is the ObjectID given to the location by mongoDB.
    locationID = p.insertedId.toString();
  } catch (errors) {
    successful = false;
    errMsg = errors;
  }

  return { status: successful, locationId: locationID, message: errMsg };
}

/**
 * The insertReview function inserts a review into the database.
 * case locationDetails.id == "":
 * 1. Add the user details to users collection
 * 2. Add the location details to locations collection (it checks if the location already exists)
 * 3. Add the review details to the review collection
 * case locationDetails.id != "":
 * 1. finds location in locations collection (checking the provided location id is valid)
 * 2. Adds review to reviews collection.
 *
 *
 * @param reviewDetails Store the review details
 * @param locationDetails Specify the location details
 * @param userDetails Create a new user in the database if it doesn't exist already
 * @param MC mongo connection object
 *
     userDetails = {
            uid: <string>,
            name: <string>, //can be empty, anonymous
            dob: <string>
            }

    locationDetails = {
            name : <string>,
            id: <string>,
            address: <json, tomom object>,
            lnglat: [lang,lat],
            category:<string>
            }
    reviewDetails = {
            locationID: <string>,
            userID: <string>,
            userText: <string>,
            soundOpinion: <double>,
            soundLevel: <double>,
            labels: <Array<string>>,
            }
 *
 * @return json
 *
 */
async function insertReview(
  reviewDetails,
  locationDetails,
  userDetails,
  MC = MongoConnection
) {
  if (locationDetails.id == "") {
    // location is new, not in DB
    // create location
    const addLocation = await insertLocation(
      locationDetails.name,
      locationDetails.lnglat[1],
      locationDetails.lnglat[0],
      locationDetails.address,
      locationDetails.category
    );


    const _lid = addLocation.locationId;
    // add review
    const reviewDoc = {
      uid: "",
      username: userDetails.name,
      userDOB: userDetails.dob,
      lid: _lid,
      userText: reviewDetails.userText,
      objectiveSound: reviewDetails.soundLevel,
      userSoundOpinion: reviewDetails.soundOpinion,
      labels: reviewDetails.labels,
      createdOn: new Date(),
    };
    let db_insertion = await MC.db(db_name)
      .collection("reviews")
      .insertOne(reviewDoc);

    if (db_insertion.insertedId) {
      return { success: true, reviewID: db_insertion.insertedId.toString() };
    } else {
      return { success: false, error: "Error with inserting the review to DB" };
    }
  } else {
    // location is in DB already
    const findPOI = await MC.db(db_name)
      .collection("locations")
      .findOne({ _id: new ObjectId(locationDetails.id) });
    if (findPOI) {
      // Location already exists in the location collection (checked by location ID)

      let reviewDocument = {
        uid: userDetails.uid,
        username: userDetails.name,
        lid: reviewDetails.locationID,
        userText: reviewDetails.userText,
        soundLevel: reviewDetails.soundLevel,
        soundOpinion: reviewDetails.soundOpinion,
        labels: reviewDetails.labels,
        createdOn: new Date(),
      };

      let db_insertion = await MC.db(db_name)
        .collection("reviews")
        .insertOne(reviewDocument);
      return { success: true, reviewID: db_insertion.insertedId.toString() };
    } else {
      // couldn't find the POI in DB
      return { success: false, error: "Couldn't find the location ID in DB" };
    }
  }
}

module.exports = { insertUser, insertLocation, insertReview };
