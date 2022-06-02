/**
 * This file will contain different queries from the DB server
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
 * Testing methods
 *
 *
 *
 * */
async function testing() {
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

testing();
