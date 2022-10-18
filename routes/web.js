const express = require('express')
const trimRequest = require('trim-request')
const uploadImage = require("../app/middleware/imageupload");

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

/* ------------ Profile Controller ------------ */ 

const { 
    edit,
    update
} = require('./../app/controller/ProfileController')

router.get(
    '/editProfile',
    authenticateUser,
    edit
)

router.post(
    '/updateProfile',
    [ authenticateUser, trimRequest.all, uploadImage.single('image') ],
    update
)

/* ------------ Post Controller ------------ */ 

const { 
    postIndex,
    postCreate
} = require('./../app/controller/PostController')

router.get(
    '/posts', 
    authenticateUser, 
    postIndex
)

router.get(
    '/posts/create', 
    authenticateUser, 
    postCreate
)

/* ------------ User Controller ------------ */ 

const { 
    storeToken
} = require('./../app/controller/UserController')

router.post(
    '/user/store-token',
    authenticateUser,
    storeToken
)

/* ------------ Auth Controller ------------ */ 

const { 
    getregister,
    register,
    login,
    loginAttempt,
    logout,
    forgetPasswordView,
    forgetPasswordPost,
    resetPasswordView,
    resetPassword,
    resetPasswordSuccess
} = require('./../app/controller/AuthController')

router.get(
    '/register',
    getregister
)

router.post(
    '/register',
    trimRequest.all,
    validate.registerweb,
    register
)

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

router.get(
    '/forget-password',
    forgetPasswordView
)

router.post(
    '/forget-passwordPost',
    forgetPasswordPost
)

router.get(
    '/reset-password/:token/:email/:val',
    resetPasswordView
)

router.post(
    '/reset-password',
    resetPassword
)

router.get(
    '/reset-password/success',
    resetPasswordSuccess
)


module.exports = router