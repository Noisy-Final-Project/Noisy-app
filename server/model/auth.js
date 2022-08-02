/** This file will contain methods that will enable authentication */

const db_name = "Noisy";
var { emailExists } = require("./fetching_queries");
var { insertUser } = require("./insert_queries");
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require("jsonwebtoken");
const { MongoConnection } = require("./mongoUtils");


async function signUp( _email, _name, _dob, password) {

  const hashedPassword = await hashPassword(password);
  let userdb = await insertUser(MongoConnection, _name, _dob, _email,hashedPassword);

  if (userdb.res == false){
    return { "error": userdb.err}
  }

// create signed token
const token = jwt.sign({ _id: userdb._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
 
  let userDetails = {"name":_name, "dob": _dob, "Email": _email, "userID":userdb.userID}
  return {token, userDetails}
}


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
