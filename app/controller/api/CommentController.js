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

    res.json({ "message": "Comment added" })

  } catch (error) {

    res.json({ error: 2, message: error.message })
  }
}

module.exports = {
  commentList,
  createComment
}