const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://dean:1122456@cluster0.a2sp2.mongodb.net/?retrywrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
let MongoConnection = new MongoClient(uri, options);

async function connectedMongo() {
  await MongoConnection.connect();
  console.log("Connected to Mongo Server");
  return MongoConnection;
}

exports.MongoConnection = MongoConnection;
exports.connectedMongo = connectedMongo;
