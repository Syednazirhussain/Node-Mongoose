const { ObjectId } = require('mongodb')
const { StatusCodes } = require('http-status-codes')

const User = require('./../../model/User')
const Role = require('./../../model/Role')

const { sendUserRegisterationEmail } = require('./../../utils/common')
const { BadRequestError, UnauthenticatedError } = require('./../../../errors')

const register = async (req, res) => {
    
    let data = req.body
    
    let role = null;
    if (req.body.hasOwnProperty('role_id')) {
        if (ObjectId.isValid(req.body.role_id)) {

            role = await Role.findById({ _id: req.body.role_id })
        }
    } else {

        role = await Role.findOne({ name: 'user' })
    }

    data.role_id = role._id

    const user = await User.create(data)

    sendUserRegisterationEmail({ email: user.email, name: user.name })

    const token = user.createJWT({ role })

    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    const role = await Role.findById({ _id: user.role_id })

    const token = user.createJWT({ role })

    // req.session.role_permissions = role.permissions;

    res.status(StatusCodes.OK).json({ user: { id: user._id, name: user.name, role_id: user.role_id }, token })
}

const me = async (req, res) => {
    try {

        res.status(StatusCodes.ACCEPTED).json(req.user)
    } catch (error) {

        throw new UnauthenticatedError(error.message)
    }
}

module.exports = {
    register,
    login,
    me
}