/**
 * This file will contain different queries from the DB server
 * that will retrieve data
 * */
const db_name = "Noisy";
// const { ObjectId } = require("bson");
const { MongoClient, ObjectId } = require("mongodb");
const { MongoConnection } = require("./mongoUtils");

/**
 * Returns the amount of reviews for a single
 * location.
 *
 * @param {MongoClient} MC  connected mongo client
 * @param {string} lid location ID
 * @returns {number} amount of reviews for that location id
 * */
async function amountReviewsLocation(_lid, MC = MongoConnection) {
  const pipeline = [{ $match: { lid: _lid } }, { $count: "amountReviews" }];

  const amount = await MC.db(db_name).collection("reviews").aggregate(pipeline);
  // Should return an integer

  let result = undefined;
  for await (const doc of amount) {
    result = doc.amountReviews;
  }
  if (result == undefined) {
    return 0;
  }
  return result;
}

/**
 * The locationByText function returns a list of locations that match the given text.
 * If it is a sentence, it will do logical or on each word
 *
 * @param MC Used to Access the mongoclient.
 * @param _text Used to Search for the text in the name field of each location.
 * @return An array of locations that match the search text (each contains _id,name,location (lat,long)).
 *
 */
async function locationByText(_text, MC = MongoConnection) {
  const query = { $text: { $search: _text } };
  // return only these fields
  const projection = {
    _id: 1,
    name: 1,
    location: 1,
  };
  let collection = await MC.db(db_name).collection("locations");
  let results = await collection.find(query).project(projection);
  // process the results
  let arr = await results.toArray();
  arr.forEach((elem) => {
    elem._id = elem._id.toString();
    let lat = elem.location.coordinates[1];
    let long = elem.location.coordinates[0];
    elem.location = [lat, long];
  });

  return arr;
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

async function getPerson(uid, MC = MongoConnection) {
  try {
    let db_person = await MC.db(db_name)
      .collection("users")
      .findOne({ _id: ObjectId(uid) });

    // If not found
    if (!db_person) {
      return { error: "person not found" };
    }

    return {
      userID: uid,
      name: db_person.name,
      dob: db_person.dob,
      email: db_person.Email,
    };
  } catch (err) {}
}
async function getLocation(lid, MC = MongoConnection) {
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
 * The getReviews function returns a list of reviews for a given location.
 *
 *
 * @param MC Used to Connect to the database.
 * @param _lid Used to Find the reviews for a specific location.
 * @param page Used to Determine which page of reviews to return.
 * @param amountReviewsPerPage Used to Determine how many reviews to display per page. default value 10
 * @return An array of review objects.
 *
 */
async function getReviews(
  _lid,
  page,
  amountReviewsPerPage = 10,
  MC = MongoConnection
) {
  const startFrom = page * amountReviewsPerPage;
  const limit = startFrom + amountReviewsPerPage;
  const query = { lid: _lid };
  const sort = { createdOn: -1 };
  const reviews = await MC.db(db_name)
    .collection("reviews")
    .find(query)
    .sort(sort)
    .skip(startFrom)
    .limit(limit);

  let result = [];

  while (await reviews.hasNext()) {
    const doc = await reviews.next();
    const _uid = doc.uid;
    const userDetails = await getPerson(MC, _uid);
    const _username =
      typeof userDetails.name == "object"
        ? userDetails.name.join(" ")
        : userDetails.name;
    const locationReview = {
      username: _username,
      userText: doc.userText,
      objectiveSound: doc.objectiveSound,
      soundOpinion: doc.userSoundOpinion,
      labels: doc.labels,
      reviewDate: doc.createdOn,
    };
    result.push(locationReview);
  }
  if (result.length == 0) {
    return { error: "no reviews found for locationID" };
  }
  return result;
}

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
async function emailExists(email, MC = MongoConnection) {
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
 * The findLocationByDist function takes in a latitude and longitude, as well as a minimal distance and maximum distance.
 * It then uses the MongoDB geospatial queries to find all locations within the specified range of the given coordinates.
 *
 *
 * @param MC Used to Connect to the database.
 * @param lt1 Used to Find the location that is closest to it.
 * @param ln1 Used to Find the closest location to it.
 * @param minimalDistance Used to Filter out locations that are too far away from the user.
 * @param maxDistance Used to Determine the maximum distance from the point given in lt and ln to be considered a match.
 * @return An array of objects that are in the range of the points given in lt and ln
 *
 */
async function findLocationByDist(
  lt1,
  ln1,
  minimalDistance,
  maxDistance,
  MC = MongoConnection
) {
  // further information https://www.mongodb.com/docs/manual/geospatial-queries/
  //  *IMPORTANT* for each point enter (that is how mongodb will look for close points): [longitude,latitude]
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

  const nearbyLocations = await MC.db(db_name)
    .collection("locations")
    .find(geoQuery);

  while (await nearbyLocations.hasNext()) {
    let loc = await nearbyLocations.next();
    locationSet.push(loc);
  }

  return locationSet;
}

/**
 * The function finds all locations in the database that are within a polygon.
 * 
 * The coordinates of the polygon are like this:
 * p3  p2
 * p1  p4
 * returns all locations in DB in this polygon
 * further information https://www.mongodb.com/docs/manual/geospatial-queries/
 * for each point: [longitude,latitude]
 * 
 * @param MC Used to Connect to the mongodb database.
 * @param p1 Used to Specify the longitude and latitude of the first point.
 * @param p2 Used to Specify the longitude and latitude of the second point.
 * @return An array of locations that are in the polygon.
 
  */

async function findLocationByRectangle(p1, p2, MC = MongoConnection) {
  // GeoJSON object type

  const p3 = [p1.lang, p2.lat];
  const p4 = [p2.lang, p1.lat];
  let square = { type: "Polygon", coordinates: [[p1, p3, p2, p4, p1]] };
  let query = {
    location: {
      $geoIntersects: { $geometry: square },
    },
  };
  let documents = await MC.db(db_name).collection("locations").find(query);
  return await documents.toArray();
}

module.exports = {
  emailExists,
  findLocationByDist,
  amountReviewsLocation,
  findLocationByRectangle,
  getLocation,
  getPerson,
  locationByLabel,
  locationByText,
  getReviews,
};
