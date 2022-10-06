const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true, 
        required: [true, 'must provide name'],
        maxlength: [20, 'name can not be more than 20 characters'],
        minlength: [3, 'name can not be less than 3 characters'],
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    permissions: {
        type: Array, 
        default: null
    }
})

module.exports = mongoose.model('Role', RoleSchema, 'roles')