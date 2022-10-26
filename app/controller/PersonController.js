const { MongoClient, ObjectId } = require('mongodb')
const { StatusCodes } = require("http-status-codes")

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

exports.personIndex = async (req, res) => {
    try {

        let perPage = 10
        let page = req.params.page || 1

        let count = await client.db('node-mongoose')
                                .collection('persons')
                                .count()

        let persons = await client.db("node-mongoose")
                                .collection('persons')
                                .find({})
                                .skip((perPage * page) - perPage)
                                .limit(perPage)
                                .toArray()

        res.status(StatusCodes.OK).render('person/index', {
            persons: persons,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}