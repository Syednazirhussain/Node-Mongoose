const { StatusCodes } = require('http-status-codes')
const { MongoClient, ObjectId } = require('mongodb')

const Post = require('./../../model/Post')

const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true
})

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

    const normalUser = await client.db('node-mongoose')
                                  .collection('users')
                                  .findOne({ _id: ObjectId(req.body.user_id) })
  
    if (ObjectId.isValid(normalUser._id)) {
  
        let post = {
            title: req.body.title,
            body: req.body.body,
            user_id: normalUser._id,
            created_at: new Date().toISOString()
        }
  
        let newPost = await client.db("node-mongoose").collection('posts').insertOne(post);
  
        res.json({ error: 0, data: newPost })
    }
  
    res.status(StatusCodes.NOT_FOUND).json({ error: 0, message: 'User not found' })
  } catch (error) {

    res.status(StatusCodes.BAD_REQUEST).json({ error: 1, message: error.message })    
  }
}

module.exports = {
  postList,
  createPost
}