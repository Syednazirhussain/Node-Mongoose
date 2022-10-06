const { v4: uuidv4 } = require('uuid')
const { StatusCodes } = require('http-status-codes')
const { MongoClient } = require('mongodb')

const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true
})

const createRole = async (req, res) => {

    try {

    let role = {
        _id: uuidv4(),
        name: req.body.name,
        created_at: new Date().toISOString()
    }

    console.log(role);

    let newRole = await client.db("node-mongoose").collection('roles').insertOne({
        name: req.body.name,
        created_at: new Date().toISOString()
    })

    // let newRole = await client.db("node-mongoose")
    //                         .collection('roles')
    //                         .insertOne(role)

    res.status(StatusCodes.OK).json({ error: 0, data: newRole })

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({ error: 1, message: error.message })
    }
}

module.exports = {
    createRole
}