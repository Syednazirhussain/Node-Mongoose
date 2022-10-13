const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const { checkPassword } = require('../middleware/auth')

const User = require('../model/User')
const mailer = require('../helper/mailer')
const { ObjectId } = require('mongodb')

async function edit(req, res) {

    try {
        const user = await User.findById(ObjectId(req.session.user_id))

        return { error: 0, user: user }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function update(req) {
    try {
        if (req.body.image !== undefined) {
            let profile = await User.findByIdAndUpdate(ObjectId(req.session.user_id), {
                name: req.body.name,
                image: process.env.APP_BASE_PATH + req.body.image.path
            });
        } else {
            let profile = await User.findByIdAndUpdate(ObjectId(req.session.user_id), {
                name: req.body.name,
            });
        }

        return { error: 0, success: "Profile Updated Successfully" }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

module.exports = { 
    edit,
    update
}