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
      return { res: true, userID: p.insertedId, err: "" };
    } catch (err) {
      return { res: false, err: "User not in DB, but failed to add it" };
    }
  } else if (alreadyInDB.status == true) {
    // email is in DB
    return { res: false, userID: alreadyInDB.userID };
  } else {
    // Other problem
    return { res: false, err: alreadyInDB.err };
  }
}

async function insertLocation(
  _name,
  latitude,
  longtitude,
  _city,
  _street,
  _num,
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
    area: [_city, _street, _num],
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

async function insertReview_old(
  reviewDetails,
  locationDetails,
  userDetails,
  MC = MongoConnection
) {
  let LID = _lid;
  // let statusInsertLocation = undefined
  if (_lid === "") {
    // adding a new location
    const _name = locationDetails.name;
    const _city = locationDetails.city;
    const _street = locationDetails.street;
    const _num = locationDetails.num;
    const _lat = locationDetails.lnglat[1];
    const _long = locationDetails.lnglat[0];
    const _category = locationDetails.category;
    const statusInsertLocation = await insertLocation(
      _name,
      _lat,
      _long,
      _city,
      _street,
      _num,
      _category,
      MC
    );
    if (statusInsertLocation.status == true) {
      // location was added successfully
      LID = statusInsertLocation.locationId;
      console.log(`Location id ${LID}\nType: ${typeof LID}`);
    } else {
      // issue with creating the location
      return statusInsertLocation;
    }
  }
  // Check if location ID already exists in the location collection.
  const findPOI = await MC.db(db_name)
    .collection("locations")
    .findOne({ _id: new ObjectId(LID) });

  if (findPOI) {
    // Location already exists in the location collection (checked by location ID)

    let reviewDocument = {
      uid: _uid,
      lid: LID,
      userText: _ut,
      objectiveSound: _usv,
      userSoundOpinion: _uso,
      labels: _labels,
      createdOn: new Date(),
    };

    let DB = await MC.db(db_name);
    let reviews = await DB.collection("reviews");
    let Q = await reviews.insertOne(reviewDocument);
    return true;
  }
  return {
    success: false,
    err: "location id should be empty OR in the locations database. Check location ID",
  };
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
            dateOfBirth: <string>
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
    // add user to DB
    const addUser = await insertUser(
      userDetails.name,
      userDetails.dob,
      "anonymous",
      ""
    );
    if (addUser.res == false && addUser.userID == undefined) {
      return { success: false, err: addUser.err };
    }

    // create location
    const addLocation = await insertLocation(
      locationDetails.name,
      locationDetails.lnglat[1],
      locationDetails.lnglat[0],
      //TODO Is this enough to specify a new location
      locationDetails.address.municipality,
      locationDetails.address.streetName,
      locationDetails.address.streetNumber,
      locationDetails.category
    );

    const _lid = addLocation.locationId;
    // add review
    const reviewDoc = {
      uid: addUser.userID,
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
      return { success: false, err: "Error with inserting the review to DB" };
    }
  } else {
    // location is in DB already
    const findPOI = await MC.db(db_name)
      .collection("locations")
      .findOne({ _id: new ObjectId(locationDetails.id) });
    if (findPOI) {
      // Location already exists in the location collection (checked by location ID)

      let reviewDocument = {
        uid: reviewDetails.userID,
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
      return { success: true, locationID: db_insertion.insertedId.toString() };
    } else {
      // couldn't find the POI in DB
      return { success: false, err: "Couldn't find the location ID in DB" };
    }
  }
}
module.exports = { insertUser, insertLocation, insertReview };
