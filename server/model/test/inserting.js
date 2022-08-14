const fetcher = require("../fetching_queries");
const inserter = require("../insert_queries");
const { MongoConnection, connectedMongo } = require("../mongoUtils");

async function testInsertLocation() {
  const locations = [
    {
      name: "abc",
      address: {freeformAddress: "modiin sd 234"},
      lnglat: [35.01291827647526, 31.88937427045248],
    },
    {
      name: "avshi1",
      address: {freeformAddress: "modiin vvvfe 33"},
      lnglat: [35.01055793254196, 31.891997777528616],
    },
    {
      name: "avshi2",
      address: {freeformAddress: "modiin 2346"},
      lnglat: [35.00635222880712, 31.890084810998772],
    },
    {
      name: "avshi3",
      address: {freeformAddress: "modiin sd 4436"},
      lnglat: [35.006155492136685, 31.90585946670268],
    },
  ];
  await MongoConnection.connect().then(() => {
    console.log("Connected to MongoDB");
  });

  for (const doc of locations) {
    let res = await inserter.insertLocation(
      doc.name,
      doc.lnglat[1],
      doc.lnglat[0],
      doc.address,
      "Restaurants"
    );
    console.log(res);
  }
}

testInsertLocation();

/**
 * Adds a  review to a location that exists
 * */
async function testInsertReview1() {
  // const poi = {
  //   name: "abc",
  //   city: "modiin",
  //   street: "df",
  //   num: "243",
  //   lid: "62f4e00d89bd801d8effbcaa",
  //   uid: "62f4e00d89bd801d8effbc23",
  //   usv: 4,
  //   uso: 3.7,
  //   ut: "Really should be able to change",
  //   labels: ["For work", "Cosy"],
  //   lnglat: [35.01291827647526, 31.88937427045248],
  // };

  const review = {
    locationID: "62f4e00d89bd801d8effbcaa",
    userID: "62f4e00d89bd801d8effbc23",
    userText: "Really should be able to change",
    soundOpinion: 3.7,
    soundLevel: 2,
    labels: ["For work", "Cosy"],
  };
  const location = {
    name: "Kapara",
    id: "62f4e00d89bd801d8effbcaa",
    address: {
      municipality: "test city",
      streetName: "test street",
      streetNumber: "7A",
    },
    lnglat: [35.01291827647526, 31.88937427045248],
    category: "test category",
  };
  const user = {
    uid: "62f4e00d89bd801d8effbc23",
    name: "Anonymous",
    dateOfBirth: [31, 7, 1995],
  };

  await MongoConnection.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  const res = await inserter.insertReview(review, location, user);
  console.log(res);
}

// testInsertReview1();

/** insert review to a location that doesn't exists, therefore creates it
 * //TODO needs to be tested with an anonymous user
 */
async function testInsertReview2() {
  const review = {
    locationID: "",
    userID: "",
    userText: "Test review for a new location",
    soundOpinion: 3.7,
    soundLevel: 2,
    labels: ["For work", "Cosy"],
  };
  const location = {
    name: "Kapara",
    id: "",
    address: {
      municipality: "test city",
      streetName: "test street",
      streetNumber: "7A",
    },
    lnglat: [35.012918276474, 31.889374270453],
    category: "test category",
  };
  const user = {
    uid: "",
    name: "Anonymous",
    dateOfBirth: [31, 7, 1995],
  };

  await MongoConnection.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  const res = await inserter.insertReview(review, location, user);
  console.log(res);
}

// testInsertReview2();
