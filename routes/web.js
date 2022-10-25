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
    [ authenticateUser, trimRequest.all, uploadImage.array('image') ],
    update
)

/* ------------ Post Controller ------------ */ 

const { 
    postIndex,
    postCreate,
    postStore,
    postEdit,
    postUpdate
} = require('./../app/controller/PostController')

router.get(
    '/posts', 
    authenticateUser, 
    postIndex
)

router.get(
    '/post/create', 
    authenticateUser, 
    postCreate
)

router.post(
    '/post/store', 
    [ authenticateUser, trimRequest.all, uploadImage.single('image') ],
    postStore
)

router.get(
    '/post/edit/:id',
    authenticateUser, 
    postEdit
)

router.put(
    '/posts/update/:id',
    authenticateUser, 
    uploadImage.single('image'),
    postUpdate
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

/* ------------ Notifications Controller ------------ */ 

const { 
    notifications,
    sendNotification
} = require('../app/controller/NotificationsController')

router.get(
    '/notifications',
    authenticateUser,
    notifications
)

router.post(
    '/send-notification',
    authenticateUser,
    trimRequest.all,
    sendNotification
)

/* ------------ Payment Controller ------------ */ 

const { 
    checkout
} = require('../app/controller/PaymentController')

router.post(
    '/create-checkout-session',
    authenticateUser,
    checkout
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