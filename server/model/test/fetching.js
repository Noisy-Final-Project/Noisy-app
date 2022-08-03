const { MongoClient } = require('mongodb')
const fetcher = require('../fetching_queries')
const inserter = require('../insert_queries')
const {MongoConnection,connectedMongo} = require('../mongoUtils')


async function testSearch(){
    const textQuery = "park"
    await MongoConnection.connect()


    const results = await fetcher.locationByText(MongoConnection, textQuery)
    console.log(results);

}

// testSearch() 

async function testGetReviews(){
    const locationID = "62e934fb02f99b3ab68465d3"
    await MongoConnection.connect()


    const results = await fetcher.getReviews(MongoConnection, locationID.at,0,2)
    console.log(results);

}

testGetReviews()