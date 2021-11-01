const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// Name : travel-agency
// Password : uqoQllWqLYpOnbjJ
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iorot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db('travel_Agency');
        const productCollection = database.collection(
            'products');
        // GET Products API
        app.get('/services', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        // GET Single Service
        app.get('/booking/:serviceId', async (req, res) => {
            const id = req.params.id;
            console.log('getting  specific service', id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.json(product);
        })
        // POST API
        app.post('/services', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);
            const result = await productCollection.insertOne(product);
            console.log(result);
            res.send(result);
        });
        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Tourism Server');
});
app.listen(port, () => {
    console.log('Running Tourism Server on port', port);
})

