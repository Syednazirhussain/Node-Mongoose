const Validator = require('validatorjs')
const { MongoClient, ObjectId } = require('mongodb')
const { StatusCodes } = require('http-status-codes')

const Comment = require('./../../model/Comment')

const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true
});

const commentList = async (req, res) => {

  try {

    let comments = await Comment.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: 'post_id',
          foreignField: '_id',
          as: 'post'
        }
      }, {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    res.status(StatusCodes.OK).json({ error: 0, comments: comments })
  } catch (error) {

    res.json({ error: 1, message: error.message })
  }
}

const createComment = async (req, res) => {

  try {

    let rules = {
      name: 'required',
      email: 'required|email',
      age: 'min:18'
    };

    let validator = new Validator({ ...req.body }, rules, {
      "required.name": ":attribute is required",
      "required.email": ":attribute is required",
      "email.email": ":attribute is not valid",
      "min.age": ":attribute should be greater then 18 years",
    })

    if (validator.fails()) {

      res.status(StatusCodes.BAD_REQUEST).json({ 
        error: 1, 
        message: 'Please fix the following errors!', 
        errors: validator.errors 
      })
    }

    if (validator.passes()) {

      const post = await client.db('node-mongoose')
                              .collection('posts')
                              .findOne({ _id: ObjectId(req.body.post_id) })
  
      const user = await client.db('node-mongoose')
                              .collection('users')
                              .findOne({ _id: ObjectId(req.body.user_id) })
  
  
      if (ObjectId.isValid(user._id) && ObjectId.isValid(post._id)) {
  
        let comment = {
          comment: req.body.comment,
          post_id: post._id,
          user_id: user._id,
          created_at: new Date().toISOString()
        }
  
        let newComment = await client.db("node-mongoose")
                                    .collection('comments')
                                    .insertOne(comment)
  
        res.json(newComment)
      }
    }

  } catch (error) {

    res.json({ error: 2, message: error.message })
  }
}

module.exports = {
  commentList,
  createComment
}