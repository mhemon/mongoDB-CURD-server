const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

// mongo credintials
// mhemon02 DhAhjtcr382t62UB

const uri = `mongodb+srv://${process.env.MONGOEMAIL}:${process.env.MONGOPASSWORD}@cluster0.ntvgsob.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // mongo database and collection
    const userCollection = client.db("usersDB").collection("users")

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/users/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      // create operation
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id
      const user = req.body
      const filter = { _id: new ObjectId(id)};

      const options = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }

      const result = await userCollection.updateOne(filter, updatedUser, options)
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('CURD SERVER RUNNING')
})

app.listen(port, () => {
  console.log(`server running at port: ${port}`);
})