const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//  middeware-------
app.use(cors());
app.use(express.json());
//  middeware-------END


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzl03ny.mongodb.net/?retryWrites=true&w=majority`;

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
    const mongodbDatabase = client.db("productList").collection("Product");
    const mongodbAddToCard = client.db("productList").collection("AddToCard");
    app.post('/AddProduct', async(req, res)=>{
        const ProInfo = req.body;
        const result = await mongodbDatabase.insertOne(ProInfo);
        res.send(result);
    })
    app.get('/AddProduct', async(req, res)=>{
        const find = mongodbDatabase.find();
        const result = await find.toArray();
        // const result2 = result.slice(0, 8);
        res.send(result);
        })
    app.get('/AddProduct/:id', async (req, res)=>{
      const id = req.params.id;
      const cursor = {_id: new ObjectId(id)};
      const result = await mongodbDatabase.findOne(cursor);
      res.send(result);
    })
    // AddtoCard Post & Get Start
    app.post('/addToCard', async(req, res)=>{
      const productAddToCard = req.body;
      const result = await mongodbAddToCard.insertOne(productAddToCard);
      res.send(result)
    })
    app.get('/addToCard', async(req, res)=>{
      let query = {};
            console.log(req.query)
            if (req.query?.email) {
                query = { userEmail: req.query.email }
            }
      const find = mongodbAddToCard.find(query);
      const result = await find.toArray();
      console.log(result)
      res.send(result);
      })
    // app.get('/addToCard', async(req, res)=>{
    //   const find = mongodbAddToCard.find();
    //   const result = await find.toArray();
    //   res.send(result);
    //   })
    app.get('/addToCard/name:id', async(req, res)=>{
      const find = req.params.id;
      const cursor = {_id: new ObjectId(find)};
      const result = await mongodbAddToCard.findOne(cursor);
      res.send(result);
    })
    
      // Delete---------------
    app.delete('/addToCard/:id', async (req, res)=>{
      const id = req.params.id;
      const findID = {_id: new ObjectId(id)};
      const cursor = await mongodbAddToCard.deleteOne(findID);
      res.send(cursor);
    })
    app.delete('/addToCard', async(req, res)=>{

    })
    // AddtoCard Post & Get END



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
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })