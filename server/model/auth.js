/** This file will contain methods that will enable authentication */

const db_name = "Noisy";
var { emailExists } = require("./fetching_queries");
var { insertUser } = require("./insert_queries");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { MongoConnection } = require("./mongoUtils");
const nanoid = require("nanoid");
// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

/**
 * The signUp function creates a new user in the database.
 *
 * 
 * @param _email Used to Store the email of the user
 * @param _name Used to Store the name of the user.
 * @param _dob Used to Store the date of birth in a string format.
 * @param password Used to Store the password entered by the user
 * @return An object with a userid and name.
 * 
 */
async function signUp(_email, _name, _dob, password) {
  const hashedPassword = await hashPassword(password);
  let userdb = await insertUser(
    _name,
    _dob,
    _email,
    hashedPassword
  );

  if (userdb.res == false) {
    return { error: userdb.err };
  }

  let userDetails = {
    name: _name,
    dob: _dob,
    Email: _email,
    userID: userdb.userID,
  };
  return { userDetails };
}

/**
 * The signIn function takes in an email and a password,
 * checks if the email exists in the database,
 * then compares the hashed password to that of what is stored in db.
 * 
 * @param _email Used to Check if the email exists in the database.
 * @param plain_password Used to Check if the password is correct.
 * @return A token and a user object.
 * 
 */
async function signIn(_email, plain_password) {
  let uid = "";
  let inDB = await emailExists(_email);
  if (inDB == false) {
    return { error: "Email doesn't exist in database" };
  }
  // check the hashed password is equal to hash in db
  const doc = await MongoConnection.db(db_name)
    .collection("users")
    .findOne({ Email: _email });

  const match = await comparePassword(plain_password, doc.password);
  if (!match) {
    return {
      error: "Wrong password",
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

/**
 * The forgotPassword function sends a reset code to the user's email address.
 *
 * 
 * @param _email Used to Find the user in the database
 * @return A promise.
 * 
 */
async function forgotPassword(_email) {  // add a field of
  let dbUser = await MongoConnection.db(db_name)
    .collection("users")
    .findOne({ Email: _email });
  if (!dbUser) {
    return { error: "Email not found" };
  }
  const resetCode = nanoid(5).toUpperCase();
  const filter = { Email: _email };
  const expirationDate = new Date();
  console.log(expirationDate.toString());
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);
  console.log(expirationDate.toString());
  const update = {
    $set: { resetCode: resetCode, expirationDate: expirationDate },
  };

  const result = await MongoConnection.db(db_name)
    .collection("users")
    .updateOne(filter, update);


  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: dbUser.Email,
    subject: "Password reset code",
    html: "<h1>Your password  reset code is: {resetCode}</h1>",
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return { error: "failed to send reset email" };
  }
}

async function resetPassword(_email, _password, _resetCode) {
  const dbUser = await MongoConnection.db(db_name).collection("users").findOne({
    Email: _email,
    resetCode: _resetCode,
  });
  if (!dbUser) {
    // Not found
    return { error: "failed to find email that matches reset code" };
  }
  // How many minutes passed  since the expiration date
  const minutesPassed = (new Date() - dbUser.expirationDate) / 60000;

  if (minutesPassed < 0) {
    // change password to new password
    // set reset code to an empty string
    const filter = { Email: _email };
    const hashPass = await hashPassword(_password);
    const update = { $set: { password: hashPass, resetCode: "" } };

    const passChange = await MongoConnection.db(db_name)
      .collection("users")
      .updateOne(filter, update);
    return { res: "Password changed successfully" };
  } else {
    return { error: "Reset code expired" };
  }
}

exports.signIn = signIn;
exports.signUp = signUp;
exports.resetPassword = resetPassword;
exports.forgotPassword = forgotPassword;
