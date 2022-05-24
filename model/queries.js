/**
 * This file will contain different queries from the DB server
 * */
const db_name = "Noisy";
var { Person, Location, Review } = require("./Model");
var { MongoUtils: MU } = require("./mongoUtils");
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
 * @returns {Array<string>} locationID
 * */
async function locationByLabel(MC, labels) {}

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
    // TODO Problem with async functions
    // doesnt print location
    printLocation(l);
  } catch (err) {
    // Do something
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
  console.log(`\tname: ${p._name}`);
  console.log(`\tCoordinates: ${l._coordinates[0]},${l._coordinates[1]}`);
  console.log(
    `\tCountry: ${l._area[0]}, City: ${l._area[1]}, Street: ${l._area[2]} ${l._area[3]}`
  );
}

testing();
