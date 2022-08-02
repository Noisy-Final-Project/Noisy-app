/** This file will contain methods that will enable authentication */

const db_name = "Noisy";
var { Person, Location, Review } = require("./Model");
var { emailExists } = require("./fetching_queries");
var { insertUser } = require("./insert_queries");

/**
 * The signUp function creates a new user in the database.
 *
 * 
 * @param MC Used to Store the user's name, email and dob in the database.
 * @param _email Used to Store the email address of the user.
 * @param _name Used to Store the name of the user.
 * @param _dob Used to Store the date of birth.
 * @param hash Used to Create a unique password for each user.
 * @return A JSON with fields: success {boolean}, error {message.
 * 
 */
async function signUp(MC, _email, _name, _dob, hash) {
  let response;
  let outcome = await insertUser(MC, _name, _dob, _email);
  if (outcome == false) {
    response = { "success": false, "msg": "email already in db" };
  } else {
    response = { "success": true, "msg": "" };
  }
  return response;
}

/**
 * The signIn function takes in a MongoClient object, an email address, and a hashed password.
 * It checks if the user is in the database by checking if their email exists. 
 * 
 * If it does not exist, then signIn returns false and an error message saying that the user is not in the database. 
 * Otherwise, it checks to see if their hashed password matches with what's stored on file for that user's account. 
 * 
 * If they do match up (meaning correct password), then signIn returns true and also gives back a unique ID.
 * If they don't match up (meaning incorrect password), then signIn returns false as well as an error message saying invalid credentials.
 * 
 * @param MC Used to Access the mongodb database.
 * @param _email Used to Check if the user is in the database.
 * @param hash Used to Check if the password is correct.
 * @return JSON, with the fields success,msg,userID
 * 
 */
async function signIn(MC, _email, hash) {
  let success = false;
  let msg = "";
  let uid = "";
  let inDB = await emailExists(MC, _email);
  if (inDB == false) {
    msg = "User not in database";
  } else {
    // check the hashed password is equal to hash in db
    const doc = await MC.db(db_name)
      .collection("users")
      .findOne({ Email: _email });
    
    if (doc.passHash === hash) { 
      // passwords (hashes) are equal, correct password

      uid = doc._id.toString()
      success = true
     }else{
        // passwords are not equal
        msg = "Passwords do not match"
     }
    }
    let response = {"success": success, "msg": msg, "userID": uid}
   return response
  
}
