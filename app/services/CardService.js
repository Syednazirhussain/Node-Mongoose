const stripe = require("stripe")(process.env.STRIPE_KEY)

const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true,
})

const store = async ({ details }) => {

  try {

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: details.number,
        exp_month: details.exp_month,
        exp_year: details.exp_year,
        cvc: details.cvc,
      },
    })

    if (paymentMethod.data != '') {
     
      await client.db("node-mongoose").collection('users').insertOne(
        {
          type: 'card',
          user_id: ObjectId(req.session.user_id),
          payment_method_id: paymentMethod.id
        })
    }

    return { error: 0, message: "Card Added Successfully" }
  } catch (error) {

    return { error: 1, message: error.message }
  }
}

module.exports = {
  store
}
