const { StatusCodes } = require('http-status-codes')

const Post = require('./../../model/Post')

const postList = async (req, res) => {

  try {
    let posts = await Post.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
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

    res.json({ error: 0, posts: posts })
  } catch (error) {
    res.json({ error: 1, message: error.message })
  }
}

module.exports = {
  postList
}