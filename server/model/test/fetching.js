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

testSearch() 