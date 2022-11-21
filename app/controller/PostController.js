const Validator = require('validatorjs')
const { MongoClient, ObjectId } = require('mongodb')
const { StatusCodes } = require("http-status-codes")

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

exports.postIndex = async (req, res) => {

    try {

        let count = await client.db('node-mongoose').collection('posts').count()

        // let posts = await client.db("node-mongoose").collection('posts').find({}).toArray()

        let perPage = 3
        let page = req.params.page || 1

        let posts = await client.db('node-mongoose').collection('posts').aggregate([{
            $lookup : {
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user"
            }
        }])
        .unwind('$user')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ 'created_at': -1 })
        .toArray()

        res.status(StatusCodes.OK).render('post/index', {
            posts: posts,
            current: page,
            pages: Math.ceil(count / perPage)
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

                let image_path = null
                if (typeof req.file != 'undefined') {
                    image_path = req.file.path
                }

                let post = {
                    title: req.body.title,
                    body: req.body.body,
                    user_id: ObjectId(req.session.user_id),
                    image: image_path,
                    created_at: new Date().toISOString()
                }
                
                
                let newPost = await client.db("node-mongoose")
                                            .collection('posts')
                                            .insertOne(post)
                console.log(newPost)
            }

            res.status(StatusCodes.OK).redirect('/posts/1')
        }

    } catch (error) {
        console.log(error);
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

        let rules = {
            title: 'required',
            body: 'required'
        }

        let validator = new Validator(inputs, rules, {
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

            res.status(StatusCodes.OK).redirect('/post/edit/'+req.params.id)
        } else {

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
            res.status(StatusCodes.OK).redirect('/posts/1')
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}

exports.postDelete = async (req, res) => {

    try {
        
        console.log(req.params.id);

        let post = await client.db("node-mongoose")
                                .collection('posts')
                                .deleteOne(
                                    { _id: ObjectId(req.params.id) }
                                )

        console.log(post)

        req.flash('success', 'Post deleted successfully')
        res.status(StatusCodes.OK).redirect('/posts')
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}