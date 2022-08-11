const fetcher = require("../fetching_queries");
const inserter = require("../insert_queries");
const { MongoConnection, connectedMongo } = require("../mongoUtils");

async function testInsertLocation() {
  const locations = [
    {
      name: "abc",
      city: "modiin",
      street: "df",
      num: "243",
      lnglat: [35.01291827647526, 31.88937427045248],
      numOfReviews: 10,
    },
    {
      name: "def",
      city: "modiin",
      street: "sd",
      num: "23",
      lnglat: [35.01055793254196, 31.891997777528616],
      numOfReviews: 123,
    },
    {
      name: "pizza",
      city: "modiin",
      street: "abs",
      num: "16",
      lnglat: [35.00635222880712, 31.890084810998772],
      numOfReviews: 334,
    },
    {
      name: "burger",
      city: "modiin",
      street: "abs",
      num: "23",
      lnglat: [35.006155492136685, 31.90585946670268],
      numOfReviews: 78,
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
      doc.city,
      doc.street,
      doc.name,
      "Restaurants"
    );
    console.log(res);
  }
}

// testInsertLocation();

/**
 * Adds a  review to a location that exists
 * */
async function testInsertReview1(){
  const poi =  {
    name: "abc",
    city: "modiin",
    street: "df",
    num: "243",
    lid: '62f4e00d89bd801d8effbcaa',
    uid: '62f4e00d89bd801d8effbc23',
    usv: 4,
    uso: 3.7,
    ut: "Really should be able to change",
    labels: ["For work","Cosy"],
    lnglat: [35.01291827647526, 31.88937427045248]
  }
  await MongoConnection.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  const res = await inserter.insertReview(poi.lid,poi.uid,poi.ut,poi.usv,poi.uso,poi.labels,{})
  console.log(res);
}

// testInsertReview1()

/** insert review to a location that doesn't exists, therefore creates it
 * 
*/
async function testInsertReview2(){
  const poi =  {
    name: "the best new location in town",
    city: "tel aviv",
    street: "df",
    num: "243",
    lid: '',
    uid: '62f4e00d89bd801d8effbc23',
    usv: 4,
    uso: 3.7,
    ut: "Really should be able to change",
    labels: ["For work","Cosy"],
    lnglat: [34.780709857880495, 32.07952541739681 ]
  }
  await MongoConnection.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  const res = await inserter.insertReview(poi.lid,poi.uid,poi.ut,poi.usv,poi.uso,poi.labels,poi)
  console.log(res);
}

testInsertReview2()