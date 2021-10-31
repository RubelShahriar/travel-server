const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const { application } = require('express');
require('dotenv').config();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qudl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('traveling');
        const packageCollection = database.collection('packages');
        const orderCollection = database.collection('orders');
        //GET API
        app.get('/packages', async(req, res) =>{
            const cursor = packageCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        })
        //GET ORDER API
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

        //GET SINGLE API
        app.get('/packages/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const findPackage = await packageCollection.findOne(query);
            res.send(findPackage);
        })
        
        //POST API FOR ADD PACKAGE
        app.post('/packages', async(req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            // console.log('hitting the post', req.body);
            // console.log('result:', result);
            res.json(result);
        })
        //POST API FOR ORDERS
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log('hitting the post', req.body)
            console.log('result:', result);
            res.json(result);
        })
        //DELETE API FOR ORDER
        app.delete('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('deleting user id', id);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})