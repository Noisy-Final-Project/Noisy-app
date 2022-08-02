
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
    const { uname, dob, email, password } = req.body;

    try {
      res.json(modelAuth.signup(uname, dob, email, password));
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
    
    res.json(modelAuth.signIn(email,password))  
    
    
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // MOVE TO MODEL
  // find user by email
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "User not found" });
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
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

const resetPassword = async function(req, res){
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

exports.signIn = signIn
exports.signUp = signUp
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
