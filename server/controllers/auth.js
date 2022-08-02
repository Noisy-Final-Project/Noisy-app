
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const nanoid = require('nanoid')
const modelAuth = require('../model/auth')


// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const signUp = async (req, res) => {
  console.log("Signup process started...");
  try {
    // validation
    const { name, dob, email, password } = req.body;

    try {
      
      res.json(await modelAuth.signUp(email, name, dob, password));
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const signIn = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    
    res.json(await modelAuth.signIn(email,password))  
    
    
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  res.json(await modelAuth.forgotPassword(email))

  // MOVE TO MODEL
  // find user by email
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return { error: "User not found" };
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: "<h1>Your password  reset code is: {resetCode}</h1>"
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    return data
  } catch (err) {
    console.log(err);
    return { 'error': 'failed to send reset email' };
  }
};

const resetPassword = async function(req, res){
  try {
    const { email, password, resetCode } = req.body;

    res.json(await modelAuth.resetPassword(email, password, resetCode))

    //MOVE TO MODEL
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return { error: "Email or reset code are invalid" };
    }
    
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return {};
  } catch (err) {
    console.log(err);
  }
};

exports.signIn = signIn
exports.signUp = signUp
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
