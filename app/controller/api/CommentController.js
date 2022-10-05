const { StatusCodes } = require('http-status-codes')

const Comment = require('./../../model/Comment')

const commentList = async (req, res) => {
    
    try {
        let comments = await Comment.aggregate([
            {
              '$lookup': {
                'from': 'posts', 
                'localField': 'post_id', 
                'foreignField': '_id', 
                'as': 'post'
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'user_id', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }
          ]);
        
        res.json({ error: 0, comments: comments })
    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}

module.exports = {
    commentList
}