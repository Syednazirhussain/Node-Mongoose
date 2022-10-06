require('dotenv').config()

const express = require('express')

const { connectDB } = require('./database/mongoose');

const app = express()

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