class MongoUtils {
  constructor() {
    // Docs used:
    // https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
    const { MongoClient, ServerApiVersion } = require("mongodb");
    const uri =
      "mongodb+srv://dean:1122456@cluster0.a2sp2.mongodb.net/?retrywrites=true&w=majority";
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  async connectDB() {
    await this.client
      .connect()
      .then(() => console.log("Connection Established"))
      .catch(() => console.log("Connection Failed"));
  }
  async closeConnection() {
    await this.client.close();
    console.log("Connection closed. Bye bye");
  }
  async listUsers() {
    let dbs = this.client.db("Noisy").collection("users").find();
    await dbs.forEach((result, i) => {
      console.log(`${i} - ${result.name[0]} ${result.name[1]}`);
      console.log(
        `\tDate of Birth: ${result.dob[2]}.${result.dob[1]}.${result.dob[0]}`
      );
      console.log(`\tEmail: ${result.Email}`);
    });
  }
}

async function main() {
  let m = new MongoUtils();
  await m.connectDB();
  await m.listUsers();
  await m.closeConnection();
}

main();
