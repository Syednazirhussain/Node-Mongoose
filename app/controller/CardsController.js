const { StatusCodes } = require("http-status-codes")

const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true,
})

const cardService = require("../services/CardService")

exports.index = async (req, res) => {

    try {
      
    let perPage = 3
    let page = req.params.page || 1
    let count = await client.db('node-mongoose').collection('cards').count()

    let result = await client.db("node-mongoose").collection('cards').find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ 'created_at': -1 })
    .toArray()

    if (result == null) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 1, message: 'Error Occurred' })
    } else {
        res.status(StatusCodes.OK).render('cards/index', {
            cards: result,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    }

  } catch (error) {
    res.json({ error: 1, message: error.message })
  }
}

exports.create = async (req, res) => { 
  try {
    
    res.status(StatusCodes.OK).render('cards/create')

  } catch (error) { 
    res.json({ error: 1, message: error.message })
  }
}

exports.store = async (req, res) => { 
  try {
    
    const { details } = req.body
    let result = await cardService.store({ details })

    if (result.error == 1) {
      res.json({ error: 1, message: result.message })
    } else {
      res.status(StatusCodes.OK).redirect('/cards/1')
    }

  } catch (error) { 
    res.json({ error: 1, message: error.message })
  }
}