const Validator = require('validatorjs')
const { StatusCodes } = require('http-status-codes')
const { MongoClient, ObjectId } = require('mongodb')

const notificationService = require('../services/notificationService')

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

exports.notifications = async (req, res) => {

    try {

        let users = await client.db('node-mongoose').collection('users')
            .find({}, { projection: { _id: 1, name: 1 } })
            .toArray()

        res.status(StatusCodes.OK).render('notifications/create', {
            users: users
        })
    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}

exports.sendNotification = async (req, res) => {

    try {

        let inputData = {...req.body}

        let rules = {
            user_id: 'required',
            title: 'required|string|min:5|max:45',
            body: 'required|string'
        }

        let validator = new Validator(inputData, rules, {
            "required.user_id": ":attribute is required",
            "required.title": ":attribute is required",
            "required.body": ":attribute is required"
        })

        if (validator.fails()) {

            req.app.locals.fields = req.body

            let errors = [
                validator.errors.get('user_id'), 
                validator.errors.get('title'), 
                validator.errors.get('body')
            ]

            errors = errors.flatMap(e => e)

            req.flash('validation_errors', errors)
            res.status(StatusCodes.BAD_REQUEST).redirect('/notifications')
        } else {

            req.app.locals.fields = {}

            const { user_id, title, body } = req.body

            let result = await notificationService.send({ title, body, user_id })
            
            if (result.error == 1) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: result.message })
            } else {
    
                req.flash('success', result.message)
                res.status(StatusCodes.OK).redirect('/notifications')
            }
        }
    } catch (error) {

        res.render({ error: 1, message: error.message })
    }

}