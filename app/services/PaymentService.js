const stripe = require("stripe")(process.env.STRIPE_KEY)

const checkout = async ({ items }) => {

  try {

    const storeItems = new Map([
      [1, { priceInCents: 10000, name: "Learn NodeJS" }],
      [2, { priceInCents: 20000, name: "Learn HTML" }]
    ])

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }

      }),
      success_url: process.env.APP_BASE_PATH,
      cancel_url: process.env.APP_BASE_PATH,
    })

    return { error: 0, message: "CheckOut link generated successfully", data: session.url }
  } catch (error) {

    return { error: 1, message: error.message }
  }
}

const pay = async ({ user, activeCard }) => {

  try {

    let customer_id

    if ((user.customer_id != undefined) && (activeCard != null) ) {
      customer_id = user.customer_id
    } else {
        return { error: 1, message: "Please add a card first and make sure it's active" }
    }

    const customer = await stripe.customers.retrieve(customer_id)

    const customerPM = await stripe.customers.listPaymentMethods(
      customer_id,
      { type: 'card' }
    )

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      customer: customer_id,
      payment_method: activeCard.payment_method_id,
      confirm: true
    })

    if (paymentIntent.status == 'succeeded') {
        return { error: 0, message: "Payment processed successfully" }
    } else {
      return { error: 1, message: "Error occurred while processing the payment" }
    }
  } catch (error) {
    return { error: 1, message: error.message }
  }
}

module.exports = {
  checkout,
  pay
}


// ----------------------------------------------------------------

// let customer_id
//     let user = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(req.session.user_id) })

//     if (user.customer_id != undefined) {

//       customer_id = user.customer_id
      
//     } else {
      
//       const createCustomer = await stripe.customers.create({
//         description: 'New Customer',
//       })
    
//       customer_id = createCustomer.id

//       await client.db("node-mongoose").collection('users').updateOne(
//         { _id: ObjectId(user._id) },
//         {
//           $set: {
//             customer_id: customer_id
//           }
//         }
//     )

//     }

//     const customer = await stripe.customers.retrieve(
//       customer_id
//     )

//     const customerPM = await stripe.customers.listPaymentMethods(
//       customer_id,
//       {type: 'card'}
//     )

//     if (customerPM.data == '') {

//       const setupIntent = await stripe.setupIntents.create({
//         payment_method_types: ['card']
//       })
      
//       const confirmIntent = await stripe.setupIntents.confirm(
//           setupIntent.id,
//           {payment_method: 'pm_card_visa'}
//       )
        
//       console.log(confirmIntent)
      
//       if (confirmIntent.status == 'succeeded') {
        
//         await stripe.paymentMethods.attach(
//             confirmIntent.payment_method,
//             {customer: customer_id}
//           )
//       }
//     }

//     const paymentMethods = await stripe.customers.listPaymentMethods(
//       customer_id,
//       {type: 'card'}
//     )

//     console.log(paymentMethods)
