const Validator = require('validatorjs')
const { StatusCodes } = require("http-status-codes")
const stripe = require("stripe")(process.env.STRIPE_KEY)

exports.stripeCustomerIndex = async (req, res) => {

    try {
        
        const balance = await stripe.balance.retrieve()

        const customers = await stripe.customers.list({
            limit: 10
        })

        res.status(StatusCodes.OK).render('stripe/customer/index', {
            customers: customers,
            balance: balance
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.stripeCustomerCreate = async (req, res) => {

    try {

        res.status(StatusCodes.OK).render('stripe/customer/create')
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.stripeCustomerStore = async (req, res) => {

    try {

        let inputData = {...req.body}

        let rules = {
            name: 'required|string',
            email: 'required|email',
            phone: 'required|numeric|min:11'
        }

        let validator = new Validator(inputData, rules, {
            "required.name": ":attribute is required",
            "required.email": ":attribute is required",
            "email.email": ":attribute must be valid",
            "required.phone": ":attribute is required",
            "numeric.phone": ":attribute must be numeric"
        })

        if (validator.fails()) {

            req.app.locals.fields = req.body
            console.log(validator.errors)

            let errors = [
                validator.errors.get('name'), 
                validator.errors.get('email'), 
                validator.errors.get('phone')
            ]

            errors = errors.flatMap(e => e)
            req.flash('validation_errors', errors)

            res.status(StatusCodes.OK).render('/stripe/customer/create')
        } else {

            const customer = await stripe.customers.create({
                ...req.body
            });
    
            if (customer.hasOwnProperty('id')) {
                req.flash("success", "Customer created successfully")
            }

            res.status(StatusCodes.OK).redirect('/stripe/customers/1')
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.stripeCustomerEdit = async (req, res) => {

    try {

        const customer_id = req.params.id

        const customer = await stripe.customers.retrieve(
            customer_id
        );
        
        const payment_id = 'pm_1M6qayAC3e2KVm2osgKVRR67'
        const payment_intent_id = 'pi_3M6qxbAC3e2KVm2o19twPhcm'
        
        // Step Four
        /*
        // Refund reason should be ['fraudulent', 'requested_by_customer']
        const refund = await stripe.refunds.create({
            payment_intent: payment_intent_id,
            reason: 'requested_by_customer'
        });
        */

        // Step Three
        /*
        const paymentIntent = await stripe.paymentIntents.retrieve(
            payment_intent_id
        );

        console.log("Payment Intent", paymentIntent);

        const confirmPaymentIntent = await stripe.paymentIntents.confirm(
            payment_intent_id,
            { payment_method: payment_id }
        );

        console.log("confirmPaymentIntent", confirmPaymentIntent);
        */

        // Step Two
        /*
        const paymentMethod = await stripe.customers.listPaymentMethods(
            customer_id,
            { type: 'card' }
        );

        console.log("paymentMethodList", paymentMethod);
        console.log("customer_id", customer_id);
        
        // Customer first payment method ID
        // console.log(paymentMethod.data[0].id);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: customer_id,
            payment_method: payment_id
        });

        console.log("paymentIntent", paymentIntent);
        console.log("payment_id", payment_id);
        */

        // Step One
        /*
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 11,
                exp_year: 2023,
                cvc: '314',
            },
        });

        console.log(payment_id);

        const paymentMethodAttach = await stripe.paymentMethods.attach(
            payment_id,
            { customer: customer_id }
        );

        console.log("paymentMethodAttach", paymentMethodAttach);

        const paymentMethod = await stripe.paymentMethods.retrieve(
            payment_id
        );

        console.log("paymentMethod", paymentMethod);
        */

        res.status(StatusCodes.OK).render('stripe/customer/edit', {
            customer: customer
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.stripeCustomerUpdate = async (req, res) => {

    try {

        const customer_id = req.params.id

        let inputData = {...req.body}

        let rules = {
            name: 'required|string',
            email: 'required|email',
            phone: 'required|numeric|min:11'
        }

        let validator = new Validator(inputData, rules, {
            "required.name": ":attribute is required",
            "required.email": ":attribute is required",
            "email.email": ":attribute must be valid",
            "required.phone": ":attribute is required",
            "numeric.phone": ":attribute must be numeric"
        })

        if (validator.fails()) {

            req.app.locals.fields = req.body
            console.log(validator.errors)

            let errors = [
                validator.errors.get('name'), 
                validator.errors.get('email'), 
                validator.errors.get('phone')
            ]

            errors = errors.flatMap(e => e)
            req.flash('validation_errors', errors)

            res.status(StatusCodes.OK).redirect('/stripe/customer/edit/'+customer_id)
        } else {

            const customer = await stripe.customers.update(
                customer_id,
                { ...req.body }
            );
    
            if (customer.hasOwnProperty('id')) {
                req.flash('success', 'Stripe customer updated')
            }
        }

        res.status(StatusCodes.OK).redirect('/stripe/customers/1')
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}


exports.stripeCustomerDelete = async (req, res) => {

    try {

        const customer_id = req.params.id

        const customer = await stripe.customers.retrieve(
            customer_id
        );
        
        if (customer.hasOwnProperty('id')) {

            const deleted = await stripe.customers.del(
                customer.id
            );

            if (deleted.hasOwnProperty('deleted') && deleted.deleted) {
                req.flash("success", 'Customer deleted successfully.')
            }

        } else {
            req.flash("error", 'Customer not found')
        }

        res.status(StatusCodes.OK).redirect('/stripe/customers/1');
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}