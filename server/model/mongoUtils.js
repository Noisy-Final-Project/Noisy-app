const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// class MongoUtils {
//   /**
//    * Generates the object and initialize it with the URI of the database on MongoDB Atlas*/
//   constructor() {
//     // Docs used:
//     // https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
//     const uri =
//       "mongodb+srv://dean:1122456@cluster0.a2sp2.mongodb.net/?retrywrites=true&w=majority";
//     Server = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverApi: ServerApiVersion.v1,
//     }).connect().then(() => console.log("Connected to Mongo"));
//   }
//   // /**
//   //  * Simple wrapper to connect to the DB*/
//   // async connectDB() {
//   //   await this.client
//   //     .connect()
//   //     .then(() => console.log("Connection Established"))
//   //     .catch(() => console.log("Connection Failed"));
//   // }
//   // /**
//   //  *Simple wrapper to disconnect to the DB */
//   // async closeConnection() {
//   //   await this.client.close();
//   //   console.log("Connection closed. Bye bye");
//   // }

//   /**
//    * This function simply gets a string of ID (given by mongo to each document)
//    * and retrurns an objectID
//    * @param {string} str string of the object ID
//    * @return {ObjectID} */
//   get_id_obj(str) {
//     let o_id = new ObjectId(str);
//     return o_id;
//   }
// }
const uri =
  "mongodb+srv://dean:1122456@cluster0.a2sp2.mongodb.net/?retrywrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
let MongoConnection = new MongoClient(uri, options);


exports.MongoConnection = MongoConnection;
