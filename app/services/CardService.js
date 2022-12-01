const stripe = require("stripe")(process.env.STRIPE_KEY)

const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true,
})

const store = async ({ number, exp_month, exp_year, cvc, loggedInUser }) => {

  try {

    let customer_id = null

    let user = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(loggedInUser.user_id) })
    
    if (user.customer_id != undefined) {
    
      customer_id = user.customer_id
    } else {

      const createCustomer = await stripe.customers.create({
        name: loggedInUser.name,
        email: loggedInUser.email
      })
    
      customer_id = createCustomer.id

      await client.db("node-mongoose").collection('users').updateOne(
          { _id: ObjectId(user._id) },
          { $set: { customer_id: customer_id } }
      )
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
      },
    })

    await stripe.paymentMethods.attach(
      paymentMethod.id,
      { customer: customer_id }
    )

    if (paymentMethod.data != '') {
     
      await client.db("node-mongoose").collection('cards').insertOne(
        {
          type: 'card',
          user_id: ObjectId(loggedInUser.user_id),
          payment_method_id: paymentMethod.id,
          status: false
        })
    }

    return { error: 0, message: "Card Added Successfully" }
  } catch (error) {
    return { error: 1, message: error.message }
  }
}

const StatusUpdate = async ({ id, status }) => {
  try {

    await client.db('node-mongoose').collection('cards').updateMany(
            {}, 
            {
              $set: { status: false }
            }
          )

    let val = (status.toLowerCase() === 'true')

      await client.db('node-mongoose').collection('cards').updateOne({
              _id: new ObjectId(id)
          },
          {
              $set: { status: val }
          })

      return { error: 0, message: "Card Status updated successfully" }
  } catch (err) {
      return { error: 1, message: err.message }
  }
}

module.exports = {
  store,
  StatusUpdate
}