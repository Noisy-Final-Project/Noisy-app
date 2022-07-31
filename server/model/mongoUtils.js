    const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
    class MongoUtils {
      /**
       * Generates the object and initialize it with the URI of the database on MongoDB Atlas*/
      constructor() {
        // Docs used:
        // https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
        const uri =
          "mongodb+srv://dean:1122456@cluster0.a2sp2.mongodb.net/?retrywrites=true&w=majority";
        this.client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverApi: ServerApiVersion.v1,
        });
      }
      /**
       * Simple wrapper to connect to the DB*/
      async connectDB() {
        await this.client
          .connect()
          .then(() => console.log("Connection Established"))
          .catch(() => console.log("Connection Failed"));
      }
      /**
       *Simple wrapper to disconnect to the DB */
      async closeConnection() {
        await this.client.close();
        console.log("Connection closed. Bye bye");
      }
      /** A function to check a reading operation, after connection was made */
      async listUsers() {
        let dbs = this.client.db("Noisy").collection("users").find();
        await dbs.forEach((result, i) => {
          console.log(` ${result._id} - ${result.name[0]} ${result.name[1]}`);
          console.log(
            `\tDate of Birth: ${result.dob[2]}.${result.dob[1]}.${result.dob[0]}`
          );
          console.log(`\tEmail: ${result.Email}`);
        });
      }
      /**
       * This function simply gets a string of ID (given by mongo to each document)
       * and retrurns an objectID
       * @param {string} str string of the object ID
       * @return {ObjectID} */
      get_id_obj(str) {
        let o_id = new ObjectId(str);
        return o_id;
      }
    }

    /** A test that shows how to use the DB driver, creating the connection only once */
    async function main() {
      let m = new MongoUtils();
      await m.connectDB();
      await m.listUsers();
      await m.closeConnection();
    }

    // main();

    exports.MongoUtils = MongoUtils;
