const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

/* ------------ Middleware ------------ */ 

const { authenticateToken } = require('./../app/middleware/jwt-auth')
const validate = require('./../app/middleware/request-validate')
const permissions = require('./../app/middleware/permissions')

/* ------------ Auth Controller ------------ */ 

const { 
    register, 
    login,
    me
} = require('./../app/controller/api/AuthContoller')

router.post(
    '/auth/register',
    trimRequest.all, 
    [ permissions.check, validate.register ],
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
    [ permissions.check, authenticateToken ],
    me
)

/* ------------ User Controller ------------ */ 

const { 
    userList,
    userUpdate,
    userDelete
} = require('./../app/controller/api/UserController')

router.get(
    '/user/list', 
    [ permissions.check, authenticateToken ],
    userList
)

router.put(
    '/user/update', 
    [ permissions.check, authenticateToken ],
    userUpdate
)

router.delete(
    '/user/delete', 
    [ permissions.check, authenticateToken ],
    userDelete
)

/* ------------ Post Controller ------------ */ 

const { 
    postList,
    createPost
} = require('./../app/controller/api/PostController')

router.get(
    '/post/list', 
    [ permissions.check, authenticateToken ],
    postList
)

router.post(
    '/post/create', 
    [ permissions.check, authenticateToken ],
    createPost
)

/* ------------ Comments Controller ------------ */ 

const { 
    commentList,
    createComment
} = require('./../app/controller/api/CommentController')

router.get(
    '/comment/list', 
    [ permissions.check, authenticateToken ],
    commentList
)

router.post(
    '/comment/create', 
    [ permissions.check, authenticateToken ],
    createComment
)

module.exports = router