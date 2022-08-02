const { MongoConnection } = require("./mongoUtils");
const {
  emailExists,
  findLocationByDist,
  getPerson,
  amountReviewsLocation,
  distCoordinates,
  findLocationByPolygon,
  getLocation,
  locationByLabel,
  locationByText,
} = require("./fetching_queries")
const inserter = require("./insert_queries");
class Review {
  _userID;
  _userText;
  _userSoundVolume;
  _userSoundOpinion;
  _labelsAttached;
  _locationID;
  /**
   * Constructor for the review class.
   * @param uid - user ID
   * @param lid - location ID
   * @param ut - The text part of the review - input of user
   * @param usv - Sound Object of the recorded sound by the user.
   * @param uso - User sound opinion - based upon an opinion or labels.
   * @param {Array<string>} labels - labels attached by the user.
   * */
  constructor(uid, lid, ut, usv, uso, labels) {
    this._userID = uid;
    this._locationID = lid;
    this._userText = ut;
    this._userSoundVolume = usv;
    this._userSoundOpinion = uso;
    this._labelsAttached = labels;
  }
}

class Location {
  _lid;
  _name;
  _coordinates;
  _area;
  /**
   * Constructor for a location class
   * @param {string} lid locationID
   * @param {string} name name of the location
   * @param {Array<Double>} coordinates x and y coordinates
   * @param {Array<string>} area country,city,street,number*/
  constructor(lid, name, coordinates, area) {
    this._lid = lid;
    this._name = name;
    this._coordinates = coordinates;
    this._area = area;
  }
}

class Person {
  _userID;
  _name;
  _dob;
  _email;
  /**
   * Constructor for person class
   * @param {string} uid - unique user ID
   * @param {Array<string>} dob - Date of birth
   * @param {Array<string>} name - [first,last,middle]
   * @param email - Email*/
  constructor(uid, name, dob, email) {
    this._userID = uid;
    this._name = name;
    this._dob = dob;
    this._email = email;
  }
}
class SoundObject {
  /**
   * This object should contain an object that will represent the sound recorded by the user.*/
}




async function objectTesting(){

  // setInterval(() => console.log("Hello"),2000)
  await MongoConnection.connect().then(() => console.log("Connected to Mongo"))
  
  // Add user
  console.log("Before insertion");
  let res = await inserter.insertUser(MongoConnection,"Ariel arieli", "12/12/2012","ariel@gmail.com","123")
  console.log(`Response:\n ${JSON.stringify(res,null,2)}`);
  console.log("After insertion");

  // Add location
  res = await inserter.insertReview(MongoConnection,"testUserID","62e8e3b0ff1f13836c2ea06f","Amazing placeAmazing place","3 stars","ObjectiveSound",["quiet", "comfy"])
  console.log(`Response:\n ${res}`);

}


objectTesting()



