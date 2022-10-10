require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const session = require("express-session")

const { connectDB } = require('./database/mongoose')

// For parsing json
app.use(
    bodyParser.json({
        limit: '20mb'
    })
)

// For parsing application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    })
)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000000 }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(flash())
app.use(express.json())

app.use(express.static('public'))
app.use(
  express.static(path.join(__dirname, "node_modules/"))
)

app.use('/', require('./routes/web'))
app.use('/api', require('./routes/api'))

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error)
    }
};

start()