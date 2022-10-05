const { StatusCodes } = require('http-status-codes')

const { NotFoundError } = require('./../../../errors')
const User = require('./../../model/User')

const userList = async (req, res) => {
    
    try {

        let  users = await User.find({})
        
        res.json({ error: 0, payload: users })
    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}

const userUpdate = async (req, res) => {
    
    try {

        const { name, email, role_id } = req.body

        let data = {
            name: name,
            email: email,
            role_id: role_id
        }

        let user = await User.findByIdAndUpdate(
            { _id: req.query.id }, 
            data, 
            { new: true, runValidators: true }
        )

        if (!user) {
            throw new NotFoundError(`No user with id ${req.query.id}`)
        }
        
        res.status(StatusCodes.OK).json({ error: 0, data: user })

    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}

const userDelete = async (req, res) => {
    
    try {

        const user = await User.findByIdAndRemove({
            _id: req.query.id
        })

        if (!user) {
            throw new NotFoundError(`No user with id ${req.query.id}`)
        }

        res.status(StatusCodes.OK).json({ error: 0, message: 'User successfully deleted.' }) 
    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}

module.exports = {
    userList,
    userUpdate,
    userDelete
}