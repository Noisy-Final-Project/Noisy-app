
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
      res.set('Access-Control-Allow-Origin', '*');

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
    res.set('Access-Control-Allow-Origin', '*');

    res.json(await modelAuth.signIn(email,password))  
    
    
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.set('Access-Control-Allow-Origin', '*');

  res.json(await modelAuth.forgotPassword(email))
};

const resetPassword = async function(req, res){
  try {
    const { email, password, resetCode } = req.body;
    res.set('Access-Control-Allow-Origin', '*');

    res.json(await modelAuth.resetPassword(email, password, resetCode))

  } catch (err) {
    console.log(err);
  }
};

exports.signIn = signIn
exports.signUp = signUp
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
