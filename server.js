const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// declare port and app
const port = process.env.PORT || 5000
const app = express()


// middleware 
app.use(cors())
app.use(express.json())



// const mongo db

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo.yuvqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const collection = client.db('collectionDb').collection('todo')
async function run() {

    try {

        app.get('/todo', async (req, res) => {
            const result = await collection.find().toArray()
            res.send(result)

        })
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id
            const result = await collection.deleteOne({ _id: ObjectId(id) })
            res.send(result)

        })
        app.post('/todo', async (req, res) => {
            const todo = req.body
            const result = await collection.insertOne({ todo })
            res.send(result)

        })
        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id
            const done = req.body
            const filter = { _id: ObjectId(id) }
            const update = { $set: { done } }
            const result = await collection.updateOne(filter, update, { upsert: true })
            res.send(result)

        })

    } finally {

    }
}

run().catch(console.dir)


// basic route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'server active now' })
})

// port listening
app.listen(port, () => console.log('server is online...'))