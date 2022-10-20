const { StatusCodes } = require('http-status-codes')

exports.cart = async (req, res) => { 

    try {
        res.status(StatusCodes.OK).render('cart/index')
    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}