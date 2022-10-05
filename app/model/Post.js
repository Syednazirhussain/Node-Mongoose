const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
        maxlength: [45, 'name can not be more than 45 characters'],
        minlength: [3, 'name can not be less than 3 characters'],
    },
    title: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
        maxlength: [191, 'name can not be more than 191 characters'],
        minlength: [11, 'name can not be less than 11 characters'],
    },
    user_id: {
        type: mongoose.ObjectId,
        required: [true, 'atleast one user must be associate'],
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema, 'posts')