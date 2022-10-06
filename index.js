require('dotenv').config()

const express = require('express')
const app = express();
const session = require("express-session");

const { connectDB } = require('./database/mongoose');

app.use(session({ secret: process.env.sessionSecret ,saveUninitialized: true,
    resave: true
}));
    
app.use(express.json())

app.use('/api', require('./routes/api'))

const port = process.env.PORT || 5000

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

start()