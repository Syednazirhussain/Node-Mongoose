const jwt = require('jsonwebtoken')
const { MongoClient } = require('mongodb')
const { StatusCodes } = require('http-status-codes')

const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true
})

const { 
    AdminPermissions, 
    ModeratorPermissions, 
    UserPermissions 
} = require('./../../config/permission')

exports.authorize = (req, res, next) => {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        
        if (err) {

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
        } else {

            req.user = decoded
    

            let permissions = await client.db("node-mongoose")
                                        .collection('permissions')
                                        .find({
                                            role_id: decoded.roleId
                                        })
                                        .toArray()

            const allowedPermission = permissions.map((o) => {
                return o.name
            })

            if (decoded.roleName == 'admin') {

                if (allowedPermission.every(permission => AdminPermissions.includes(permission))) {
                    console.log('authorized')
                    next()
                } else {
                    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access forbidden' })
                }

            } else if (decoded.roleName == 'moderator') {
                
                if (allowedPermission.every(permission => ModeratorPermissions.includes(permission))) {
                    console.log('authorized')
                    next()
                } else {
                    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access forbidden' })
                }

            } else if (decoded.roleName == 'user') {
                
                if (allowedPermission.every(permission => UserPermissions.includes(permission))) {
                    console.log('authorized')
                    next()
                } else {
                    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access forbidden' })
                }
            } else {
                
                res.status(StatusCodes.FORBIDDEN).json({ message: 'Access forbidden' })
            }
        }
    })
}