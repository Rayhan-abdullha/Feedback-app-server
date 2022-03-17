const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
const cors = require("cors")
require('dotenv').config()

const port = process.env.PORT || 4200

app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcnnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("masterFood").collection("usersBd");
  // perform actions on the collection object
  
  // Get
  app.get("/feed", async(req, res) => {
    const cursor = collection.find({})
    const users = await cursor.toArray()
    res.send(users)
  })
  // Post
  app.post("/feed", async (req, res) => {
    const newUsers = req.body;
    const user = await collection.insertOne(newUsers)
    res.json(user)
  })
  // Delete
  app.delete("/feed/:id", async (req, res) => {
    const id = req.params.id
    const query = {_id: ObjectId(id)};
    const result = await collection.deleteOne(query);
    res.json(result)
  })

  // Find single feed
  app.get("/feed/:id", async (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const feed = await collection.findOne(query)
    res.json(feed)
  })

  // Update feed
  app.put("/feed/:id", async (req, res) => {
    const id = req.params.id;
    const updateFeed = req.body;
    const filter = {_id: ObjectId(id)};
    const option = {upsert: true};
    const updateDoc = {
      $set: {
        text: updateFeed.text,
        rating: updateFeed.rating,
      },
    }
    const result = await collection.updateOne(filter, updateDoc, option)
    res.json(result)
  })

  //   client.close();
});




app.listen(port, () => console.log("listing port", port))