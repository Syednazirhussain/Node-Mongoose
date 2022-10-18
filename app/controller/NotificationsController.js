const notificationService = require('../services/notificationService')
const { StatusCodes } = require('http-status-codes')

exports.notifications = async (req, res) => {

    try {
        res.status(StatusCodes.OK).render('notifications/create', { message: req.flash('message') });

    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}

exports.sendNotification = async (req, res) => {

    try {
        let result = await notificationService.send(req)

        if (result.error == 1) { 
            res.json({ error: 1, message: result.message })
        } else {
            res.status(StatusCodes.OK).render('notifications/create', { error: 0, success: result.message })
        }

    } catch (error) {
        res.render({ error: 1, message: error.message })
    }

}