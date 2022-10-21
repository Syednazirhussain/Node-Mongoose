require('dotenv').config()

const express = require('express')

const app = express()
const cors = require('cors')
const path = require('path')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const session = require("express-session")
const methodOverride = require('method-override')
const common_helper = require('./app/helper/common')

const { connectDB } = require('./database/mongoose')

app.use(cors({ origin: '*' }))

common_helper(app)
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
app.use(methodOverride())
app.use(express.static('public'))
app.use(
    express.static(path.join(__dirname, "node_modules/"))
)

app.use('/public', express.static(path.join(__dirname, "public")))

app.use('/', require('./routes/web'))
app.use('/api', require('./routes/api'))

// throw 404 if URL not found
app.all("*", function (req, res) {
    return res.render("errors/404.ejs")
})

const port = process.env.PORT || 5000

const start = async () => {

    try {

        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        )
    } catch (error) {
        console.log(error)
    }
}

start()