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
      res.render("errors/500", { message: error.message })
  }
}

exports.create = async (req, res) => { 
  try {
    
    res.status(StatusCodes.OK).render('cards/create')

  } catch (error) { 
      res.render("errors/500", { message: error.message })
  }
}

exports.store = async (req, res) => { 
  try {
    
    let user = { ...req.session }
    let { number, exp_month, exp_year, cvc } = { ...req.body }

    let result = await cardService.store({ number, exp_month, exp_year, cvc, user })

    if (result.error == 1) {
      res.json({ error: 1, message: result.message })
    } else {
      req.flash('success', result.message)
      res.status(StatusCodes.OK).redirect('/cards')
    }

  } catch (error) { 
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("errors/500", { message: error.message })
  }
}

exports.UpdateStatus = async (req, res) => {

  let { id, status } = { ...req.params }

  let result = await cardService.StatusUpdate({ id, status })

  if (result.error == 1) {
      req.flash('error', result.message)
      res.status(StatusCodes.Ok).redirect('/cards')
  } else {
      req.flash('success', result.message)
      res.status(StatusCodes.OK).redirect('/cards')
  }
}