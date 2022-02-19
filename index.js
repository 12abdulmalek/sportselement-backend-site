const os = require('os');
const express = require('express');
// const res = require('express/lib/response');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const res = require('express/lib/response');
const { send } = require('express/lib/response');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// sportsElement
// vIsGur5uqC0vKTYm


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nasnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("sportsElement");
        const sportsElement = database.collection("sportsMaterial");

        // get data from api
        app.get('/users', async (req, res) => {
            const item = req.body;
            const page =parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const cursor = sportsElement.find({});
            let result;
            const count = await sportsElement.count();
            if (page) {
              result = await cursor.skip(page*size).limit(size).toArray();
            }
            else {
                result = await cursor.limit(size).toArray();
            }
            res.send({
                count,
                result
            });


        })
        // to get data from unique id 
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sportsElement.findOne(query)
            res.json(result);
        })
        // post data from api 
        app.post('/users', async (req, res) => {
            const item = req.body;
            const result = await sportsElement.insertOne(item);
            res.json(result);
        })
        //  delete data from api 

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sportsElement.deleteOne(query);
            res.json(result)
        })
        app.get('/user', async (req, res) => {
            res.json('go go go');
        })
        app.get('/userere', async (req, res) => {
            res.json('go go gddo');
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.json('hitting the backend');
})
app.listen(port, () => {

    console.log('hit the backend ',os.version(),os.arch(),os.freemem(),os.platform(),os.release(),os.type());
})