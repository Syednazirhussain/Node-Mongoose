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