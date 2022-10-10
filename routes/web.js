const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

/* ------------- Middleware ------------- */

const { authenticateUser } = require('./../app/middleware/auth')
const validate = require('./../app/middleware/request-validate')

/* ------------- Middleware ------------- */

router.get('/', (req, res) => {
    res.redirect('/home')
})

/* ------------- Home Controllers ------------- */

const { 
    home 
} = require('./../app/controller/HomeController')

router.get(
    '/home', 
    authenticateUser, 
    home
)

/* ------------ Auth Controller ------------ */ 

const { 
    login,
    loginAttempt,
    logout
} = require('./../app/controller/AuthController')

router.get(
    '/login',
    login
)

router.post(
    '/login',
    trimRequest.all,
    validate.login,
    loginAttempt
)

router.get(
    '/logout',
    authenticateUser,
    logout
)

module.exports = router