const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

//mongodbapi
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfyyfuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//mongodb try function start---
async function run() {
  try {
    const formCollection = client.db("formCollection").collection("data");

    // post data to DB
    app.post("/add", async (req, res) => {
      const data = req.body;
      const result = await formCollection.insertOne(data);
      res.send(result);
    });

    // get all data list from DB
    app.get("/data", async (req, res) => {
      const query = {};
      const cursor = formCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    // get all data by Id from DB
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await formCollection.findOne(query);
      res.send(cursor);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));
// Express
app.listen(port, () => {
  console.log("Server running on port", port);
});

app.get("/", (req, res) => {
  res.send("Server Running");
});
