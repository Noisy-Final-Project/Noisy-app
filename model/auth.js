/** This file will contain methods that will enable authentication */

const db_name = "Noisy";
var { Person, Location, Review } = require("./Model");
var { emailExists } = require("./fetching_queries");
var { insertUser } = require("./insert_queries");


async function signUp(MC, _email, _name, _dob, hash) {
  let response;
  let outcome = await insertUser(MC, _name, _dob, _email);
  if (outcome == false) {
    response = { success: false, msg: "email already in db" };
  } else {
    response = { success: true, msg: "" };
  }
  return response;
}


async function signIn(_email, hash) {
  let inDB = await emailExists(MC, _email);
  if (inDB == false) {
  } else {
    // return a cookie
  }
}
