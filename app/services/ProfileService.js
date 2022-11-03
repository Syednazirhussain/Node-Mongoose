const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const { checkPassword } = require('../middleware/auth')

const User = require('../model/User')
const mailer = require('../helper/mailer')
const { ObjectId } = require('mongodb')

const edit = async ({ user_id }) => {

    try {

        const user = await User.findById(ObjectId(user_id))
        return { error: 0, user: user }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}

const update = async ({ name, image, user_id }) => {

    try {

        let updateObj = {
            name: name
        }

        if (image !== undefined) {
            updateObj['image'] = process.env.APP_BASE_PATH + image.path
        }

        await User.findByIdAndUpdate(ObjectId(user_id), updateObj)

        return { error: 0, message: "Profile Updated Successfully" }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}

module.exports = {
    edit,
    update
}