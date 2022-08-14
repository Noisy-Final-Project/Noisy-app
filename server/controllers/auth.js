
const jwt = require("jsonwebtoken");
const modelAuth = require('../model/auth')

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

const verifyToken = async function(req, res){
  try {
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    const token = authHeader.replace('Bearer ', '')

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    res.set('Access-Control-Allow-Origin', '*');

    res.json(verified)

  } catch (err) {
    if (err.message == 'jwt expired'){
      res.json({error: err.message})
    }
    console.log(err);
  }
};

exports.signIn = signIn
exports.signUp = signUp
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
exports.verifyToken = verifyToken
