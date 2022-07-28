/**
 * This file will contain different queries from the DB server
 * that will retrieve data
 * */
const db_name = "Noisy";
var { Person, Location, Review } = require("./Model");
var { MongoUtils: MU } = require("./mongoUtils");

async function forgotPass(_newPass, _email) {
  // TODO create instace of mail client
  // TODO Send mail with new password
  // TODO create a new field in user's document in user collections
  // that will contain the oldpassword.
  // Whenever the user connects with new password, put the oldpassword in oldPasswird field
  // in user's document (in DB) and put instead the hash of _newPass
}

/**
 * Returns the amount of reviews for a single
 * location.
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {string} lid location ID
 * @returns {number} amount of reviews for that location id
 * */
async function amountReviewsLocation(MC, lid) {}

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
 * Returns the location that its name contains text, in an certain area.
 * if area is null -> search in all areas
 * @param {MongoClient} MC  connected mongo client
 * @param {Array<string>} area specifies city/country
 * @param {string} _text user search text
 * @returns {Array<string>} locationID
 * */
async function locationByText(MC, area, _text) {}
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
 * Return a person object out of DB based on personID
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {string} uid
 * @returns {Person} */
async function getPerson(MC, uid) {
  let o_id = MC.get_id_obj(uid);
  try {
    let db_person = await MC.client
      .db(db_name)
      .collection("users")
      .findOne({ _id: o_id });
    return new Person(uid, db_person.name, db_person.dob, db_person.Email);
  } catch (err) {}
}
/**
 * Return a location object out of DB based on location ID
 * @param {MongoClient} MC  connected mongo client
 * @param {string} lid location ID
 * @returns {Location} */
async function getLocation(MC, lid) {
  let o_id = MC.get_id_obj(lid);
  try {
    let db_location = await MC.client
      .db(db_name)
      .collection("locations")
      .findOne({ _id: o_id });
    return new Location(
      lid,
      db_location.name,
      db_location.coordinates,
      db_location.area
    );
  } catch (err) {
    // Do something
  }
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
    let db_emailExists = await MC.client
      .db(db_name)
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
 * The findLocationByRadius function finds all locations within a radius of the given coordinates.
 *
 *
 * @param MC Used to Connect to the mongodb database.
 * @param lt1 Used to Store the latitude of the user.
 * @param ln1 Used to Set the longitude of the user.
 * @param radius Used to Find the locations that are within a certain radius of the user's location.
 * @param locCountry Used to Filter the locations by country.
 * @return A list of locations within the radius.
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
  let nearbyLocations
  try{
    nearbyLocations = await MC.client
      .db(db_name)
      .collection("locations")
      .find(geoQuery);

  }catch(e){  
    console.log(e);
  }

  // if (nearbyLocations._eventsCount == 0) {
  //   // there are no events for this location and radius
  //   return [];
  // }
  while (await nearbyLocations.hasNext()) {
    let loc = await nearbyLocations.next();
    let dbLocLn = loc["location"]["coordinates"][0];
    let dbLocLt = loc["location"]["coordinates"][1];
    let distanceFromParameters = distCoordinates(lt1, ln1, dbLocLt, dbLocLn);
    locationSet.push(loc)
  }

  return locationSet;
}

async function findLocationByPolygon(MC, p1, p2, p3, p4) {
  /**
   * TODO not working
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
  let documents = await MC.client
    .db(db_name)
    .collection("locations")
    .find(query);
  console.log(documents);
}

/**
 * The distCoordinates function takes in two pairs of latitude and longitude coordinates,
 * and returns the distance between them.
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
  meters_distance = Math.round(6371000 * 2 * Math.asin(Math.sqrt(a)));
  return meters_distance;
}

/**
 * Testing methods
 *
 *
 *
 * */
async function testingFetchingUserLocation() {
  let M = new MU();

  await M.connectDB();
  let lid = "628c125a7af17e516baa7f42";
  let uid = "62895832625ace8c5c715825";
  try {
    let p = await getPerson(M, uid);
    printPerson(p);

    let l = await getLocation(M, lid);
    printLocation(l);
  } catch (err) {
    // Do something
    console.log(err);
  } finally {
    await M.closeConnection();
  }
}

async function testingEmailExists() {
  let M = new MU();

  await M.connectDB();
  fakeEmail = "carmfidean@gmail.com";
  existingEmail = "carmidean@gmail.com";
  try {
    let p1 = await emailExists(M, fakeEmail);
    let p2 = await emailExists(M, existingEmail);
    console.log(`Is ${fakeEmail} in the DB? ${p1}`);
    console.log(`Is ${existingEmail} in the DB? ${p2}`);
  } catch (err) {
    // Do something
  } finally {
    await M.closeConnection();
  }
}

async function testingLocDist() {
  let M = new MU();

  await M.connectDB();

  let lt1 = 40.77110878055151;
  let ln1 = -73.97258495332737;

  // locCountry = "Israel";
  let D = 100000;
  let set
  try {
     set = await findLocationByDist(M, lt1, ln1, 1, D);
  } catch (error) {}
  set.forEach(console.log);
}

testingLocDist();
module.exports.emailExists = emailExists;
