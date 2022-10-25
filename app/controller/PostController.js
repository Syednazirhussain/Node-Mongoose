const Validator = require('validatorjs')
const { MongoClient, ObjectId } = require('mongodb')
const { StatusCodes } = require("http-status-codes")

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

        // console.log(posts)

        res.status(StatusCodes.OK).render('post/index', {
            posts: posts
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.postCreate = async (req, res) => {
    try {
        res.status(StatusCodes.OK).render('post/create')
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.postStore = async (req, res) => {

    try {

        let inputData = {...req.body}

        let rules = {
            title: 'required',
            body: 'required'
        }

        let validator = new Validator(inputData, rules, {
            "required.title": ":attribute is required",
            "required.body": ":attribute is required"
        })

        if (validator.fails()) {

            req.app.locals.fields = req.body
            console.log(validator.errors)

            let errors = [
                validator.errors.get('title'), 
                validator.errors.get('body')
            ]

            errors = errors.flatMap(e => e)
            req.flash('validation_errors', errors)

            res.status(StatusCodes.OK).render('post/create')
        } else {

            req.app.locals.fields = {}

            if (ObjectId.isValid(req.session.user_id)) {
                
                console.log(req.file.path)

                let post = {
                    title: req.body.title,
                    body: req.body.body,
                    user_id: ObjectId(req.session.user_id),
                    image: req.file.path,
                    created_at: new Date().toISOString()
                }
                
                
                let newPost = await client.db("node-mongoose")
                                            .collection('posts')
                                            .insertOne(post)
                console.log(newPost)
            }

            res.status(StatusCodes.OK).redirect('/posts')
        }

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.postEdit = async (req, res) => {
    
    try {

        let post = await client.db("node-mongoose")
                                    .collection('posts')
                                    .findOne({ _id: ObjectId(req.params.id) })
        res.status(StatusCodes.OK).render('post/edit', { post: post })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.postUpdate = async (req, res) => {
    
    try {

        let inputs = {...req.body}
        
        if (typeof req.file != 'undefined') {
            inputs['image'] = req.file.path
        }

        let post = await client.db("node-mongoose")
                                .collection('posts')
                                .updateOne(
                                    { _id: ObjectId(req.params.id) },
                                    { $set: inputs }
                                )
        console.log(post)
        
        req.flash('success', 'Post updated successfully')
        res.status(StatusCodes.OK).redirect('/posts')
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

