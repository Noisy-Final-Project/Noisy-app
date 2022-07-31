/**
 * This file will contain different queries from the DB server
 * that will insert data
 * */
// TODO Insert of all these functions into a class
const db_name = "Noisy";
// var { Person, Location, Review } = require("./Model");
var { MongoUtils: MU } = require("./mongoUtils");
var { emailExists: EE, findLocationByDist } = require("./fetching_queries");
/**
 * The insertUser function inserts a new user into the database.
 *
 *
 * @param MC Used to Connect to the mongodb database.
 * @param name Used to Create a new user.
 * @param dob Used to Store the date of birth (comes as a string "DD/MM/YYYY").
 * @param email Used to Check if the user already exists in the database.
 * @return {bool} true if user was added, otherwise false.
 *
 *
 */
async function insertUser(MC, _name, _dob, _email, _hash) {
  var alreadyInDB = await EE(MC, _email);
  if (alreadyInDB == false) {
    const doc = {
      name: _name.trim().split(/\s+/),
      dob: _dob.split("/"),
      Email: _email,
      passHash: _hash,
    };
    try {
      let p = await MC.client.db(db_name).collection("users").insertOne(doc);
      return true;
    } catch (err) {
      return false;
    }
  } else if (alreadyInDB == true) {
    // email is in DB
    return false;
  } else {
    // Other problem
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

  let nearbyLoc = await findLocationByDist(MC,latitude,longtitude,0,50)

  if (nearbyLoc.length != 0){
    for (let i = 0; i < nearbyLoc; i++){
      if (nearbyLoc[i].name == _name){
        //TODO needs testing 
        successful = false;
        errMsg = "location within 50 meters exists with this name";
      }
    }
  }
  else{

    
      let geoObject = { type: "Point", coordinates: [longtitude, latitude] };
      let document = {
        name: _name,
        location: geoObject,
        area: [_city, _street, _num],
        category: _category,
        created_on: new Date()
      };
      let successful;
      let errMsg;
      try {
        let p = await MC.client
          .db(db_name)
          .collection("locations")
          .insertOne(document)
          .then(() => {
            successful = true;
          })
          .catch((err) => {
            successful = false;
            errMsg = err;
          });
      } catch (errors) {}
  }
return {status:successful, message:errMsg}

}

/**
 * The insertReview function inserts a new review into the database.
 *
 *
 * @param MC Used to Access the mongoclient object.
 * @param uid Used to Identify the user who is posting the review.
 * @param lid Used to Identify the location of the review.
 * @param ut Used to Determine the type of review.
 * @param usv Used to Store the value of the user's rating.
 * @param uso Used to Determine whether the user has already rated this movie.
 * @param labels Used to Store the labels of the review.
 * @return A promise.
 *
 * TODO should also insert automatically the date the review was created on
 * Example:
 * db.mycollection.insert({ 'created_on' : new Date() })
 *
 */
async function insertReview(MC, uid, lid, ut, usv, uso, labels) {}

async function testingInsertUser() {
  let M = new MU();

  await M.connectDB();
  try {
    let p = await insertUser(
      M,
      "Avshi The King",
      "17/11/70",
      "avsha@gmail.com"
    );
  } catch (err) {
    // User is in DB or another issue
  } finally {
    await M.closeConnection();
  }
}

// testingInsertUser();