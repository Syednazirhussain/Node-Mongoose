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

    let customer_id
    let user = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(req.session.user_id) })

    if (user.customer_id != undefined) {

      customer_id = user.customer_id
      
    } else {
      
      const createCustomer = await stripe.customers.create({
        description: 'New Customer',
      })
    
      customer_id = createCustomer.id

      await client.db("node-mongoose").collection('users').updateOne(
        { _id: ObjectId(user._id) },
        {
          $set: {
            customer_id: customer_id
          }
        }
    )

    }

    const customer = await stripe.customers.retrieve(
      customer_id
    )

    const customerPM = await stripe.customers.listPaymentMethods(
      customer_id,
      {type: 'card'}
    )

    if (customerPM.data == '') {

      const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['card']
      })
      
      const confirmIntent = await stripe.setupIntents.confirm(
          setupIntent.id,
          {payment_method: 'pm_card_visa'}
      )
        
      console.log(confirmIntent)
      
      if (confirmIntent.status == 'succeeded') {
        
        await stripe.paymentMethods.attach(
            confirmIntent.payment_method,
            {customer: customer_id}
          )
      }
    }

    const paymentMethods = await stripe.customers.listPaymentMethods(
      customer_id,
      {type: 'card'}
    )

    console.log(paymentMethods)

    res.status(StatusCodes.OK).render('stripe/payments/checkout', {
      customer: customer
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
  }
}