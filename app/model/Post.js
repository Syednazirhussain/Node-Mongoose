const { mongoose, ObjectId } = require('mongoose');

const PostSchema = new mongoose.Schema({
    genre: {
        type: String,
        lowercase: true,
        required: [true, 'must be provided'],
        enum: ['social', 'politics', 'religional']
    },
    title: {
        type: String,
        trim: true,
        unique: [true, 'is unique'],
        required: [true, 'must be provided'],
        maxlength: [45, 'name can not be more than 45 characters'],
        minlength: [3, 'name can not be less than 3 characters'],
    },
    body: {
        type: String,
        trim: true,
        required: [true, 'must be provided'],
        maxlength: [191, 'name can not be more than 191 characters'],
        minlength: [11, 'name can not be less than 11 characters'],
    },
    rating: {
        type: Number,
        required: [true, 'must be provided'],
        // validate(value) {
        //     if (value < 1 || value > 5) {
        //         throw new Error('rating should be in between 1 to 5')
        //     }
        // },
        validate: {
            validator: (value) => {
                return value >= 1 || value <= 5 
            },
            message: 'rating should be in between 1 to 5'
        },
    },
    user_id: {
        type: ObjectId,
        required: [true, 'should be associate'],
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema, 'posts')