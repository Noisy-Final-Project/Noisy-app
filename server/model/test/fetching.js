// const { MongoClient } = require('mongodb')
const fetcher = require("../fetching_queries");
const inserter = require("../insert_queries");
const { MongoConnection, connectedMongo } = require("../mongoUtils");

async function testSearch() {
  const textQuery = "park";
  await MongoConnection.connect();

  const results = await fetcher.locationByText(textQuery);
  console.log(results);
}

// testSearch()

async function testGetReviews() {
  const locationID = "62e23687e1389d1ba38c9eca";
  await MongoConnection.connect();

  const results = await fetcher.getReviews(locationID, 0, 10, MongoConnection);
  console.log(results);
}

// testGetReviews();

async function testAmountReviews() {
  const locationID = "62f4e00d89bd801d8effbcaa";
  await MongoConnection.connect();
  const results = await fetcher.amountReviewsLocation(
    locationID,
    MongoConnection
  );

  console.log(`Amount of reviews : ${results}`);
}

// testAmountReviews();
async function testLocationPolygon() {
  const P1 = { lng: 34.47913007324439, lat: 31.54676361380794 };
  const P2 = { lng: 35.375237144059895, lat: 32.49054283372567 };
  await MongoConnection.connect();
  const geoQuery = await fetcher.findLocationByRectangle(
    P1,
    P2,
    MongoConnection
  );
  for (const doc of geoQuery) {
    console.log(doc);
  }
}

// testLocationPolygon();
