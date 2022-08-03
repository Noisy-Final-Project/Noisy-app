/**
 * This file will contain different queries from the DB server
 * that will retrieve data
 * */
const db_name = "Noisy";
const { ObjectId } = require("bson");
const { MongoClient } = require("mongodb");
const {MongoConnection} = require("./mongoUtils")

/**
 * Returns the amount of reviews for a single
 * location.
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {string} lid location ID
 * @returns {number} amount of reviews for that location id
 * */
async function amountReviewsLocation(MC, _lid) {
  const amount = await MC.db("db_name")
    .collection("reviews")
    .aggregate([{ $count: _lid }]);
  // Should return an integer
  return amount[_lid];
}

/**
 * Returns the location with certain lables
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {Array<string>} labels labels to be searched for
 * @param {Array<string>} area specifies city/country
 * @returns {Array<string>} locationID
 * */
async function locationByLabel(MC, labels, area) {}

/**
 * The locationByText function returns a list of locations that match the given text.
 * If it is a sentence, it will do logical or on each word
 * 
 * @param MC Used to Access the mongoclient.
 * @param _text Used to Search for the text in the name field of each location.
 * @return An array of locations that match the search text (each contains _id,name,location (lat,long)).
 * 
 * @doc-author Trelent
 */
async function locationByText(MC, _text) {
  const query = { $text: { $search: _text } };
  // return only these fields
  const projection = {
    _id: 1,
    name: 1,
    location:1,
  };
  let collection = await MC.db(db_name).collection("locations")
  let results = await collection.find(query).project(projection);
  // process the results
  let arr = await results.toArray();
  arr.forEach( (elem) => {
    elem._id = elem._id.toString()
    let lat = elem.location.coordinates[1]
    let long = elem.location.coordinates[0]
    elem.location = [lat, long]
  })

  return arr
}
/**
 * Returns the location with certain lables
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {Array<string>} labels labels to be searched for
 * @param {Array<string>} userLocation current GPS location of user
 * @param {double}  radius maximal radius to search in
 * @returns {Array<string>} locationID
 * */
async function locationByLabel(MC, labels, userLocation, radius) {}
/**
 * Return a person details out of DB based on personID
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {string} uid
 * @returns JSON */
async function getPerson(MC, uid) {
  let o_id = MC.get_id_obj(uid);
  try {
    let db_person = await MC.db(db_name)
      .collection("users")
      .findOne({ _id: o_id });
    return {
      userID: uid,
      name: db_person.name,
      dob: db_person.dob,
      email: db_person.Email,
    };
  } catch (err) {}
}
/**
 * Return a location object out of DB based on location ID
 * @param {MongoClient} MC  connected mongo client
 * @param {string} lid location ID
 * @returns JSON with fields {lid,name,coordinates,area} if found,false otherwise */
async function getLocation(MC, lid) {
  try {
    let db_location = await MC.db(db_name)
      .collection("locations")
      .findOne({ _id: ObjectId(lid) });

    if (db_location != null) {
      let res = {
        lid: lid,
        name: db_location.name,
        coordinates: db_location.coordinates,
        area: db_location.area,
      };
      return res;
    } else {
      return false;
    }
  } catch (err) {
    // Do something
  }
  return false;
}
/**
 * Return a review object out of DB based on review ID
 * @param {MongoClient} MC  connected mongo client
 * @param {string} rid location ID
 * @returns {Review} */
async function getReview(MC, rid) {}

/**
 * The emailExists function checks to see if the email is already in use.
 *
 *
 * @param {MongoClient} MC Used to Connect to the mongodb database.
 * @param {string} email  Used to Check if the email already exists in the database.
 * @return A promise that resolves to a boolean.
 *
 *
 */
async function emailExists(MC, email) {
  try {
    let db_emailExists = await MC.db(db_name)
      .collection("users")
      .findOne({ Email: email });
    // db_emailExists returns the document, if it exists.
    if (db_emailExists != null) {
      return true;
    }
    return false;
  } catch (err) {
    // console.log(err);
    return "Email checking failed";
  }
}

/**
 * The findLocationByDist function finds all locations within a certain distance of the given coordinates.
 *
 *
 * @param MC Used to query to the database.
 * @param lt1 Used to Set the latitude of the location to be searched.
 * @param ln1 Used to Get the longitude of the user's location.
 * @param minimalDistance Used to Filter out locations that are too far away from the user's location.
 * @param maxDistance Used to Set the maximum distance from the location to be returned.
 * @return An array of locations that are within a certain radius.
 *
 */
async function findLocationByDist(MC, lt1, ln1, minimalDistance, maxDistance) {
  // further information https://www.mongodb.com/docs/manual/geospatial-queries/
  //  *IMPORTANT* for each point: [longitude,latitude]
  var locationSet = [];
  let geoJSON = { type: "Point", coordinates: [ln1, lt1] };

  let geoQuery = {
    location: {
      $near: {
        $geometry: geoJSON,
        $maxDistance: maxDistance,
        $minDistance: minimalDistance,
      },
    },
  };
  let nearbyLocations;
  try {
    nearbyLocations = await MC.db(db_name)
      .collection("locations")
      .find(geoQuery);
  } catch (e) {
    console.log(e);
  }

  while (await nearbyLocations.hasNext()) {
    let loc = await nearbyLocations.next();
    let dbLocLn = loc["location"]["coordinates"][0];
    let dbLocLt = loc["location"]["coordinates"][1];
    let distanceFromParameters = distCoordinates(lt1, ln1, dbLocLt, dbLocLn);
    locationSet.push(loc);
  }

  //TODO should I close the connection to the curser here? check mongoDB docs
  return locationSet;
}

async function findLocationByPolygon(MC, p1, p2, p3, p4) {
  /**
   //TODO not working
   * The coordinates of the polygon are like this:
   * p1  p2
   * p3  p4
   * returns all locations in DB in this polygon
   * further information https://www.mongodb.com/docs/manual/geospatial-queries/
   * for each point: [longitude,latitude]
   */
  // GeoJSON object type
  let square = { type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]] };
  let query = {
    location: {
      $geoIntersects: { $geometry: square },
    },
  };
  let documents = await MC.db(db_name).collection("locations").find(query);
  console.log(documents);
}

/**
 * The distCoordinates function takes in two pairs of latitude and longitude coordinates,
 * and returns the distance between them in meters.
 *
 *
 * @param lt1 Used to Store the latitude of the first coordinate.
 * @param ln1 Used to Calculate the distance between two points on a map.
 * @param lt2 Used to Calculate the distance between two points on a sphere.
 * @param ln2 Used to Calculate the distance between two points on a sphere.
 * @return The distance between two points in meters.
 *
 *
 */
function distCoordinates(lt1, ln1, lt2, ln2) {
  // using Haversine formula
  var dLat = ((lt1 - lt2) * Math.PI) / 180;
  var dLon = ((ln1 - ln2) * Math.PI) / 180;
  var a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lt1 * Math.PI) / 180) *
      Math.cos((lt2 * Math.PI) / 180) *
      (1 - Math.cos(dLon))) /
      2;
  let meters_distance = Math.round(6371000 * 2 * Math.asin(Math.sqrt(a)));
  return meters_distance;
}

module.exports = {
  emailExists,
  findLocationByDist,
  amountReviewsLocation,
  distCoordinates,
  findLocationByPolygon,
  getLocation,
  getPerson,
  locationByLabel,
  locationByText,
};
