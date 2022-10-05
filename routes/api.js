const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

/* ------------ Middleware ------------ */ 

const { authenticateToken } = require('./../app/middleware/jwt-auth')
const validate = require('./../app/middleware/request-validate')

/* ------------ Auth Controller ------------ */ 

const { 
    register, 
    login,
    me
} = require('./../app/controller/api/AuthContoller')

router.post(
    '/auth/register',
    trimRequest.all, 
    validate.register,
    register
)

router.post(
    '/auth/login',
    trimRequest.all,
    validate.login,
    login
)

router.get(
    '/auth/me', 
    authenticateToken,
    me
)

/* ------------ User Controller ------------ */ 

const { 
    userList,
    userUpdate
} = require('./../app/controller/api/UserController')

router.get(
    '/user/list', 
    authenticateToken,
    userList
)

router.put(
    '/user/update', 
    authenticateToken,
    userUpdate
)

/* ------------ Post Controller ------------ */ 

const { 
    postList,
} = require('./../app/controller/api/PostController')

router.get(
    '/post/list', 
    authenticateToken,
    postList
)

/* ------------ Comments Controller ------------ */ 

const { 
    commentList,
} = require('./../app/controller/api/CommentController')

router.get(
    '/comment/list', 
    authenticateToken,
    commentList
)

module.exports = router