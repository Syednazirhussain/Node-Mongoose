const { StatusCodes } = require("http-status-codes")
const stripe = require("stripe")(process.env.STRIPE_KEY)

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

    const customer_id = req.params.customer_id
    
    const customer = await stripe.customers.retrieve(
      customer_id
    );

    res.status(StatusCodes.OK).render('stripe/payments/checkout', {
      customer: customer
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
  }
}