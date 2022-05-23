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

class Person {
  _userID;
  _dob;
  _email;
  /**
   * Constructor for person class
   * @param uid - unique user ID
   * @param dob - Date of birth
   * @param email - Email*/
  constructor(uid, dob, email) {
    this._userID = uid;
    this._dob = dob;
    this._email = email;
  }
}
class SoundObject {
  /**
   * This object should contain an object that will represent the sound recorded by the user.*/
}
