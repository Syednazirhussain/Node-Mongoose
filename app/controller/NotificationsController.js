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

        console.log(users.length)

        res.status(StatusCodes.OK).render('notifications/create', {
            users: users
        })
    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}

exports.sendNotification = async (req, res) => {

    try {

        let result = await notificationService.send(req)
        
        console.log(result)

        if (result.error == 1) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: result.message })
        } else {

            req.flash('success', result.message)
            res.status(StatusCodes.OK).redirect('/notifications')
        }
    } catch (error) {
        res.render({ error: 1, message: error.message })
    }

}