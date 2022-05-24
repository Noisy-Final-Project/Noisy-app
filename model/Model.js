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
   * @param {Array<Double>} x and y coordinates
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

exports.Person = Person;
exports.Review = Review;
exports.Location = Location;