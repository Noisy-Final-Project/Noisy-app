/**
 * This file will contain different queries from the DB server
 * that will retrieve data
 * */
const db_name = "Noisy";
// const { StylePropType } = require("react-native-web-ui-components");
var { Person, Location, Review } = require("./Model");
var { MongoUtils: MU } = require("./mongoUtils");
// global.fetch = require("node-fetch"); // set fetch for nodeJS
var GeoCode = require("geo-coder").GeoCode;

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
 * @doc-author Trelent
 */
async function findLocationByRadius(MC, lt1, ln1, radius,locCountry) {
  //TODO This doesnt work.
  // This fetches the country of the location based on the lat,lon
  var locCountry = "";
  var locationSet = [];

  // var geocode = new GeoCode();
  // await geocode.reverse(lt1, ln1).then((result) => {
  //   locCountry = result["raw"]["address"]["country"];
  // });

  // if (locCountry != "") {
  //   try {
  //     let nearbyLocations = await MC.client
  //       .db(db_name)
  //       .collection("locations")
  //       .find({ country: locCountry });

  //     // Keep in mind that the type of nearbyLocation is a "Cursor"
  //     // //
  //     // while (nearbyLocations.hasNext()) {
  //     //   let loc = nearbyLocations.next;
  //     //   let lt2 = loc[coordinates][0];
  //     //   let ln2 = loc[coordinates][1];
  //     //   let dist = distCoordinates(lt1, ln1, lt2, ln2);
  //     //   if (dist < radius) {
  //     //     locationSet.push(loc);
  //     //   }
  //     // }
  //     return await nearbyLocations
  //       .toArray()
  //       .filter(
  //         (t) =>
  //           distCoordinates(lt1, ln1, t[coordinates][0], t[coordinates][1]) <
  //           radius
  //       );
  //   } catch (err) {
  //     // Do something
  //   }
  //   return locationSet;
  // } 
    let nearbyLocations = await MC.client
      .db(db_name)
      .collection("locations")
      .find();
    
    
    while (await nearbyLocations.hasNext()) {
      
      let loc = await nearbyLocations.next()
      let dbLocLt = loc["coordinates"][0]
      let dbLocln = loc["coordinates"][1]
      let distanceFromParameters = distCoordinates(lt1,ln1,dbLocLt, dbLocln)
      if ( distanceFromParameters < radius){
        locationSet.push(loc)
      }
    }
  
  return locationSet;
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

function printPerson(p) {
  console.log(`ID: ${p._userID}`);
  console.log(`\tname: ${p._name[0]} ${p._name[1]}`);
  console.log(`\tDOB: ${p._dob[2]}.${p._dob[1]}.${p._dob[0]}`);
  console.log(`\tEmail: ${p._email}`);
}
function printLocation(l) {
  console.log(`ID: ${l._lid}`);
  console.log(`\tname: ${l._name}`);
  console.log(`\tCoordinates: ${l._coordinates[0]},${l._coordinates[1]}`);
  console.log(
    `\tCountry: ${l._area[0]}, City: ${l._area[1]}, Street: ${l._area[2]} ${l._area[3]}`
  );
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

  let lt1 = 32.139782892460985;
  let ln1 = 34.79933707118085;
  let lt2 = 32.146755638878304 
  let ln2=34.81627421227488
  let dist = distCoordinates(lt1,ln1,lt2,ln2)
  console.log(`Distance between points ${dist}`);

  let radius = 100000;
  let nearbyLocations = await M.client
    .db(db_name)
    .collection("locations")
    .find({ country: "Israel" });
  try {
    set = await findLocationByRadius(M, lt1, ln1, radius);
  } catch (error) {}
}

testingLocDist();
module.exports.emailExists = emailExists;
