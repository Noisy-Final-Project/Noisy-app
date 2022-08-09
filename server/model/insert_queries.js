/**
 * This file will contain different queries from the DB server
 * that will insert data
 * */

const db_name = "Noisy";
var { emailExists, getLocation, findLocationByDist } = require("./fetching_queries");
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


async function insertLocation(
  MC,
  _name,
  latitude,
  longtitude,
  _city,
  _street,
  _num,
  _category,
) {
  let successful;
  let errMsg;
  let locationID;

 // Check if the location already exists in the database
 const maxDistance = 100
 const locationNearby = await findLocationByDist(MC,latitude,longtitude,2,maxDistance)

 for await (const doc of locationNearby){
  if (doc.name == _name){
    // location already exists in the database
    return {status: false, message: "location already exists in the database", locationID: doc._id}
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


async function insertReview(MC,_lid, _uid, _ut, _usv, _uso, _labels, locationDetails ) {
  if (_lid === ""){
    // adding a new location
    const _name = locationDetails.name;
    const _city = locationDetails.city;
    const _street = locationDetails.street;
    const _num = locationDetails.num;
    const _lat = locationDetails.lat;
    const _long = locationDetails.long
    const _category = locationDetails.category;
    const statusInsertLocation = await insertLocation(MC,_name,_lat,_long,_city,_street,_num,_category)
    if (statusInsertLocation.status == true) {
      // location was added successfully
      _lid = statusInsertLocation.locationID
    }else{
      // issue with creating the location 
      return statusInsertLocation
    }
  }
  
  
  // Check if location ID already exists in the database.
  const findPOI = await MC.db(db_name)
    .collection("locations")
    .findOne({ lid: _lid });

  if (findPOI) {
    // Location already exists in the database (checked by location ID)

    let reviewDocument = {
      uid: _uid,
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
