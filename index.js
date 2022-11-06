const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjecId = require("mongodb").ObjectId;
const res = require("express/lib/response");
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// name:user1
// password:quTFHIJ0klFVAnVV

const uri =
  "mongodb+srv://user1:quTFHIJ0klFVAnVV@cluster0.89zame3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("users");

    // POST user: add a new user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("adding new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // get user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // Delete
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjecId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjecId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // update
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const UpdateUser = req.body;
      const filter = { _id: ObjecId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: UpdateUser.name,
          email: UpdateUser.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // // create a document to insert
    // const user = {
    //     name: "Sharon Das",
    //     email: "Sharon1@gmail.com",
    //   };
    //   const result = await userCollection.insertOne(user);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Runnig my node CRUD server");
});

app.listen(port, () => {
  console.log("My Server is running");
});
