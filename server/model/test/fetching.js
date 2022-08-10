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
  const locationID = "62e934fb02f99b3ab68465d3";
  await MongoConnection.connect();

  const results = await fetcher.amountReviewsLocation(
    MongoConnection,
    locationID
  );
  console.log(results);
}

// testGetReviews()

async function testAmountReviews() {
  const locationID = "62e8e3b0ff1f13836c2ea06f";
  await MongoConnection.connect();
  const results = await fetcher.amountReviewsLocation(
    MongoConnection,
    locationID
  );

  console.log(`Amount of reviews : ${results}`);
}

// testAmountReviews();
async function testLocationPolygon() {
  const P1 = [-73.9719582809264, 40.79688259197476 ];
  const P2 = [-73.9113379760125, 40.84129692366408 ];
  await MongoConnection.connect();
  const geoQuery = await fetcher.findLocationByRectangle(MongoConnection, P1, P2);
  for (const doc of geoQuery) {
    console.log(doc);
  }
}

// testLocationPolygon();
