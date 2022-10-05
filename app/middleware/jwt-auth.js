const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message })
        }

        req.user = decoded
    })

    next()
}