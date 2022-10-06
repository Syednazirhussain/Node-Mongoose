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

    res.status(StatusCodes.OK).json({ error: 0, posts: posts })
  } catch (error) {

    res.json({ error: 1, message: error.message })
  }
}

const createPost = async (req, res) => {

  try {

    let inputData = { ...req.body }

    const newPost = new Post(inputData)
    const error = newPost.validateSync();

    if (error && error.errors != null) {

      res.status(StatusCodes.BAD_REQUEST).json({ error: 1, errors: error.errors })
    } else {

      await newPost.save()
      
      res.status(StatusCodes.OK).json({ error: 0, message: 'Post created successfully', data: newPost })
    }

  } catch (error) {

    res.status(StatusCodes.BAD_REQUEST).json({ error: 1, message: error.message })    
  }
}

module.exports = {
  postList,
  createPost
}