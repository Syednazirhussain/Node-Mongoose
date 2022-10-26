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
    home,
    AddBulkRecords
} = require('./../app/controller/HomeController')

router.get(
    '/home', 
    authenticateUser, 
    home
)

router.get(
    '/addBulk',
    AddBulkRecords
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
    postUpdate,
    postDelete
} = require('./../app/controller/PostController')

router.get(
    '/posts/:page', 
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

router.post(
    '/post/update/:id',
    [ authenticateUser, trimRequest.all, uploadImage.single('image') ],
    postUpdate
)

router.post(
    '/post/delete/:id',
    authenticateUser,
    postDelete
)

/* ------------ Person Controller ------------ */ 

const { 
    personIndex
} = require('./../app/controller/PersonController')

router.get(
    '/persons/:page',
    authenticateUser,
    personIndex
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