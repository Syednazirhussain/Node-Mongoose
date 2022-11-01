const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide'],
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
        minlength: [3, 'name can not be less than 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'must provide'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'must provide'],
        minlength: 6,
    },
    image: {
        type: String,
    },
    provider_id: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        default: 'local'
    },
    role_id: {
        type: mongoose.ObjectId,
        required: [true, 'must associated with any role like admin, moderator, or user'],
    },
    devices: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function ({ role }) {
    return jwt.sign(
        { userId: this._id, name: this.name, roleId: role._id, roleName: role.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema, 'users')