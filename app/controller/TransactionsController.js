const stripe = require("stripe")(process.env.STRIPE_KEY)

const { MongoClient, ObjectId } = require('mongodb')
const { StatusCodes } = require("http-status-codes")

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

const Swal = require('sweetalert2')

exports.transactionsIndex = async (req, res) => {

    try {
        Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
        const paymentIntents = await stripe.paymentIntents.list({})

        console.log(paymentIntents.data['9'].charges.data['0'].refunded)
        
        res.status(StatusCodes.OK).render('transactions/index', {
            transactions: paymentIntents.data
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.refund = async (req, res) => {

    try {

        let { intentId } = { ...req.params }
       
        const refund = await stripe.refunds.create({
            payment_intent: intentId,
        })

        if (refund.status == 'succeeded') {
            req.flash('success', 'The payment has been successfully refunded')
            res.status(StatusCodes.OK).redirect('/transactions')
        } else {
            req.flash('error', 'Some error occurred')
            res.status(StatusCodes.OK).redirect('/transactions')
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}