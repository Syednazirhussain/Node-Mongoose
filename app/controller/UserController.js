const { StatusCodes } = require('http-status-codes')
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

exports.storeToken = async (req, res) => {

    try {

        let user_id = req.session.user_id

        let deviceCheck = await client.db("node-mongoose").collection('users').findOne({
            devices: {
                $elemMatch: {
                    device_token: req.body.device_token
                }
            }, "_id": new ObjectId(user_id)
        })

        req.session.device_token = req.body.device_token

        if (deviceCheck == null) {

            await client.db('node-mongoose').collection('users').updateOne(
                { _id: new ObjectId(user_id) },
                {
                    $push: {
                        devices: {
                            device_token: req.body.device_token,
                            device_type: req.body.device_type,
                        }
                    }
                }
            )

            res.status(StatusCodes.OK).json({ error: 0, message: 'Token Stored' })
        } else {

            res.status(StatusCodes.BAD_REQUEST).json({ error: 0, message: 'Token Already Exist' })
        }
    } catch (error) {
        res.render('errors/500', { error: 1, message: error.message })
    }
}