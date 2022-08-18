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
  const amount = await MC.db(db_name)
    .collection("reviews")
    .countDocuments({ lid: _lid });
  const result = amount;
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
 * The locationByLabel function takes in an array of location ids and an array of labels.
 * It returns a list of locations that have the given labels.
 *
 * 
 * @param lids Used to Filter out the locations that have been labeled
 * @param labelsArray Used to Filter the locations
 * @param MC=MongoConnection Used to Connect to the database
 * @return A list of locations that have the labels.
 * 
 */
async function locationByLabel(lids, labelsArray, MC = MongoConnection) {
  const locations = {lid: { $in: lids }};
  const containLabels = { labels: { $in: labelsArray } };
  const query = { $and: [locations, containLabels] };
  const groupby = { _id: "$lid" };
  const filteredLids = await MC.db(db_name)
    .collection("reviews")
    .aggregate([{ $match: query }, { $group: groupby }])
    .toArray();
  // console.log("Filtered lids:\n" + JSON.stringify(filteredLids));
  const obj_ids = [];
  for (const l of filteredLids) {
    const o_lid = new ObjectId(l._id);
    obj_ids.push(o_lid);
  }

  // console.log("After changing to ObjectId:\n" + obj_ids.toString());
  const locationWithLabels = await MC.db(db_name)
    .collection("locations")
    .find({ _id: { $in: obj_ids } });
  const labeledLocations = await locationWithLabels.toArray();
  return labeledLocations;
}

/**
 * The getPerson function returns a person object with the following properties:
 * userID, name, dob and email.
 *
 * 
 * @param uid Used to Identify the user.
 * @param MC=MongoConnection Used to Make the function more generic.
 * @return A json represents a person.
 * 
 */
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
  } catch (err) {
    return { error: err };
  }
}
async function getLocation(lid, MC = MongoConnection) {
  try {
    let db_location = await MC.db(db_name)
      .collection("locations")
      .findOne({ _id: new ObjectId(lid) });

    if (db_location != null) {
      let res = {
        lid: lid,
        name: db_location.name,
        coordinates: db_location.coordinates,
        address: db_location.address,
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
  const isValid = await getLocation(_lid);
  if (!isValid) {
    return {
      error:
        "Couldn't find location with id " + _lid + "in collection locations",
    };
  }
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

    let _username = doc.username;
    if (!_username) {
      _username = "anonymous";
    }
    const locationReview = {
      username: _username,
      userText: doc.userText,
      soundLevel: doc.soundLevel,
      soundOpinion: doc.soundOpinion,
      labels: doc.labels,
      reviewDate: doc.createdOn,
    };
    result.push(locationReview);
  }
  // if (result.length == 0) {
  //   return {status:true ,error: "no reviews found for locationID" };
  // }
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
      return { status: true, userID: db_emailExists._id.toString() };
    }
    return { status: false, error: "No user in DB with this email" };
  } catch (err) {
    // console.log(err);
    return { status: false, error: "Email checking failed: \n" + err };
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

async function findLocationByRectangle(
  p1,
  p2,
  labelArray,
  MC = MongoConnection
) {
  const p3 = [p1.lng, p2.lat];
  const p4 = [p2.lng, p1.lat];
  // GeoJSON object type
  let square = {
    type: "Polygon",
    coordinates: [
      [Object.values(p1), p3, Object.values(p2), p4, Object.values(p1)],
    ],
  };
  let query = {
    location: {
      $geoIntersects: { $geometry: square },
    },
  };
  
  let documents = await MC.db(db_name).collection("locations").find(query);


  if (labelArray.length > 0) {
    const lids = [];
    for await (const doc of documents) {
      lids.push(doc._id.toString())
    }
    documents = await locationByLabel(lids, labelArray);
  }

  let locations = [];
  for await (const doc of documents) {
    const amountReviews = await amountReviewsLocation(doc._id.toString());
    locations.push({
      id: doc._id.toString(),
      name: doc.name,
      address: doc.address,
      lnglat: [doc.location.coordinates[0], doc.location.coordinates[1]],
      count: amountReviews,
    });
  }
  return locations
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
