const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_uSER}:${process.env.DB_PASS}@cluster0.nlw4swl.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

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
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    app.get('/coffee', async(req ,res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/coffee/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const coffee ={
        $set:{
          name:updatedCoffee.name, quantity:updatedCoffee.quantity, category:updatedCoffee.category, supply:updatedCoffee.supply ,taste:updatedCoffee.taste, photo:updatedCoffee.photo, detail:updatedCoffee.details
        }
      }
      const result = await coffeeCollection.updateOne(filter,coffee,options)
      res.send(result)
    })
    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
    })

    app.delete('/coffee:id', async(req,res) =>{
      const id = req.params.id;
      console.log(id)
    
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
catch{
   
} }
run()
app.get('/',(req,res)=>{
   res.send('Coffee server is running ')
})

app.listen(port,() =>{
    console.log(`Coffee server is running on PORT ${port}`)
})

