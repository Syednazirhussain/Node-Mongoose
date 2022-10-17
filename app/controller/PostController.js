const { StatusCodes } = require("http-status-codes")
const { MongoClient } = require('mongodb')

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

exports.postIndex = async (req, res) => {

    try {

        // let posts = await client.db("node-mongoose").collection('posts').find({}).toArray()

        let posts = await client.db('node-mongoose').collection('posts').aggregate([{
            $lookup : {
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user"
            }
        }]).unwind('$user').sort({ 'created_at': -1 }).toArray();

        console.log(posts)

        res.status(StatusCodes.OK).render('post/index', {
            posts: posts
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 1, message: error.message })
    }

}