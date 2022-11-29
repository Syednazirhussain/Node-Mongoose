const stripe = require("stripe")(process.env.STRIPE_KEY)

const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true,
})

const store = async ({ number, exp_month, exp_year, cvc, user_id }) => {

  try {

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
      },
    })

    if (paymentMethod.data != '') {
     
      await client.db("node-mongoose").collection('cards').insertOne(
        {
          type: 'card',
          user_id: ObjectId(user_id),
          payment_method_id: paymentMethod.id,
          status: false
        })
    }

    return { error: 0, message: "Card Added Successfully" }
  } catch (error) {

    return { error: 1, message: error.message }
  }
}

async function UpdateStatus({ _id, value }) {
  try {

    let status = (value.toLowerCase() === 'true')

      await client.db('node-mongoose').collection('cards').updateOne({
              _id: new ObjectId(_id)
          },
          {
              $set: { status: status }
          })
      return {
          error: 0, message: "Card Status updated successfully"
      }
  } catch (err) {
      return {
          error: 1, message: err.message
      }
  }
}