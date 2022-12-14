const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const uploadImage = require("../app/middleware/imageupload");

require('./../config/passport-setup')

const router = express.Router()

/* ------------- Middleware ------------- */

const { authenticateUser, isLoggedIn } = require('./../app/middleware/auth')
const validate = require('./../app/middleware/request-validate')

/* ------------- Middleware ------------- */

router.get('/', (req, res) => {
    res.redirect('/home')
})

/* ------------- Passport Social Signup ------------- */

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        if (req.user) {
            req.session.user_id = req.user.id
            req.session.name = req.user.name
            req.session.email = req.user.email
            req.session.image = req.user.photos[0].value
        }
        res.redirect('/home')
    }
)

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/facebook/callback', 
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        if (req.user) {
            req.session.user_id = req.user._json.id
            req.session.name = req.user._json.name
            req.session.email = req.user._json.email
            req.session.image = req.user.photos[0].value
        }
        res.redirect('/home');
    }
);

// app.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'sindh/karachi' }));
router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
    }), 
    (req, res) => {
        if (req.user) {
            req.session.user_id = req.user.id
            req.session.name = req.user.name
            req.session.email = req.user.email
            req.session.image = req.user.image
        }
        res.redirect('/home');
    }
);

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
    personIndex,
    personCreate,
    personStore,
    personEdit,
    personUpdate,
    emailCSV
} = require('./../app/controller/PersonController')

router.get(
    '/persons/:page/:value?',
    authenticateUser,
    personIndex
)

router.get(
    '/person/create',
    authenticateUser,
    personCreate
)

router.post(
    '/person/store',
    authenticateUser,
    personStore
)

router.get(
    '/person/edit/:id',
    authenticateUser,
    personEdit
)

router.post(
    '/person/update/:id',
    authenticateUser,
    personUpdate
)

router.get(
    '/person/email/csv',
    authenticateUser,
    emailCSV
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