const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'must provide comment'],
        trim: true,
        maxlength: [191, 'comment can not be more than 191 characters'],
        minlength: [11, 'comment can not be less than 11 characters'],
    },
    user_id: {
        type: mongoose.ObjectId,
        required: [true, 'atleast one user must be associate'],
    },
    post_id: {
        type: mongoose.ObjectId,
        required: [true, 'atleast one post must be associate'],
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', CommentSchema, 'comments')