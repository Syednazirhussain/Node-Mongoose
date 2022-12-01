const { StatusCodes } = require("http-status-codes")
const stripe = require("stripe")(process.env.STRIPE_KEY)

const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true,
})

const paymentService = require("../services/PaymentService")

exports.checkout = async (req, res) => {

  try {

    const { items } = req.body
    let result = await paymentService.checkout({ items })

    if (result.error == 1) {
      res.json({ error: 1, message: result.message })
    } else {
      res.status(StatusCodes.OK).json({ url: result.data })
    }

  } catch (error) {
    res.json({ error: 1, message: error.message })
  }
}

exports.stripeCheckout = async (req, res) => {
  try {
    
    let customer = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(req.session.user_id) })
    res.status(StatusCodes.OK).render('stripe/payments/checkout', { customer })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
  }
}

exports.pay = async (req, res) => {
  try {
    
    let user = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(req.session.user_id) })
    let activeCard = await client.db('node-mongoose').collection('cards').findOne({ user_id: ObjectId(user._id), status: true })

    let result = await paymentService.pay({ user, activeCard })

    if (result.error == 1) {
      req.flash("error", result.message)
    } else {
      req.flash("success", result.message)
    }

    res.status(StatusCodes.PERMANENT_REDIRECT).redirect('/stripe/checkout')
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
  }
}
