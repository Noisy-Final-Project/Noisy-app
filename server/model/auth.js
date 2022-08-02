/** This file will contain methods that will enable authentication */

const db_name = "Noisy";
var { emailExists } = require("./fetching_queries");
var { insertUser } = require("./insert_queries");
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require("jsonwebtoken");
const { MongoConnection } = require("./mongoUtils");

/**
 * The signUp function creates a new user in the database.
 *
 *
 * @param MC Used to Store the user's name, email and dob in the database.
 * @param _email Used to Store the email address of the user.
 * @param _name Used to Store the name of the user.
 * @param _dob Used to Store the date of birth.
 * @param hash Used to Create a unique password for each user.
 * @return A JSON with fields: success {boolean}, error {string}.
 *
 */
async function signUp( _email, _name, _dob, password) {

  const hashedPassword = await hashPassword(password);
  let userdb = await insertUser(MongoConnection, _name, _dob, _email,hashedPassword);

// create signed token
const token = jwt.sign({ _id: userdb._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
 
  let userDetails = {"name":_name, "dob": _dob, "Email": _email, "userID":userdb.userID}
  return {token, userDetails}
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
async function signIn( _email, plain_password) {
  let uid = "";
  let inDB = await emailExists(MongoConnection, _email);
  if (inDB == false) {
    return {"error": "Email doesn't exist in database"}
  } 
    // check the hashed password is equal to hash in db
    const doc = await MongoConnection.db(db_name)
      .collection("users")
      .findOne({ Email: _email });

      const match = await comparePassword(plain_password, doc.password);
      if (!match) {
        return {
          "error": "Wrong password",
        };
      }
    
      // passwords (hashes) are equal, correct password
      uid = doc._id.toString();
      
      const token = jwt.sign({ _id: uid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      doc.password = undefined;
      // doc.secret = undefined;
      return {
        token,
        doc,
      };
}
