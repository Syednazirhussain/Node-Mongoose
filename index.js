require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const router = express.Router()

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
});

const { connectDB } = require('./database/mongoose');


router.route('/').get((req, res) => {
    res.json({ "message": "Welcome to node mongoose" })
})



router.route('/comment/create').post(async (req, res) => {

    return res.json({ "message": "This api is temporarily closed" })

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
                                .insertOne(comment);

        res.json(newComment)
    }    


    res.json({ "message": "Comment added" })
})

router.route('/post/create').post(async (req, res) => {

    return res.json({ "message": "This api is temporarily closed" })

    const normalUser = await client.db('node-mongoose').collection('users').findOne({ _id: ObjectId(req.body.user_id) })

    if (ObjectId.isValid(normalUser._id)) {

        let post = {
            title: req.body.title,
            body: req.body.body,
            user_id: normalUser._id,
            created_at: new Date().toISOString()
        }

        let newPost = await client.db("node-mongoose").collection('posts').insertOne(post);

        res.json(newPost)
    }

    res.json({ "message": "User not found" })
})


router.route('/role/create').post(async (req, res) => {

    return res.json({ "message": "This api is temporarily closed" })

    let role = {
        _id: uuidv4(),
        name: req.body.name,
        created_at: new Date().toISOString()
    }

    console.log(role);

    let newRole = await client.db("node-mongoose").collection('roles').insertOne({
        name: req.body.name,
        created_at: new Date().toISOString()
    });

    // let newRole = await client.db("node-mongoose")
    //                         .collection('roles')
    //                         .insertOne(role);

    res.json(newRole)
})

router.route('/user/create').post(async (req, res) => {

    return res.json({ "message": "This api is temporarily closed" })

    let pwdHash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

    let adminRole = await client.db("node-mongoose").collection('roles').findOne({ name: 'moderator' });

    // console.log(adminRole);
    // console.log(ObjectId.isValid(adminRole._id));

    let user = {
        name: req.body.name,
        email: req.body.email,
        password: pwdHash,
        role_id: adminRole._id,
        created_at: new Date().toISOString()
    }

    let newUser = await client.db("node-mongoose").collection('users').insertOne(user);

    res.json(newUser)
})

app.use(router)
app.use(express.json());
app.use('/api', require('./routes/api'))

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();