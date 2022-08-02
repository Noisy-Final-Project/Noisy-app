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

async function signUp(_email, _name, _dob, password) {
  const hashedPassword = await hashPassword(password);
  let userdb = await insertUser(
    MongoConnection,
    _name,
    _dob,
    _email,
    hashedPassword
  );

  if (userdb.res == false) {
    return { error: userdb.err };
  }

  // create signed token
  const token = jwt.sign({ _id: userdb._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  let userDetails = {
    name: _name,
    dob: _dob,
    Email: _email,
    userID: userdb.userID,
  };
  return { token, userDetails };
}

async function signIn(_email, plain_password) {
  let uid = "";
  let inDB = await emailExists(MongoConnection, _email);
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

async function forgotPassword(_email) {
  // add a field of
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

  const result = await await MongoConnection.db(db_name)
    .collection("users")
    .updateOne(filter, update);
  result.then(() => {
    console.log("Expiration Date: " + expirationDate);
  });

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
  const dbUser = await MongoConnection.db(db_name).collection.findOne({
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
