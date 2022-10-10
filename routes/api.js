const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

/* ------------ Middlewares ------------ */ 

const { authorize } = require('./../app/middleware/permissions')
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
    [ validate.register ],
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
    [ authenticateToken, authorize ],
    me
)

/* ------------ Permission Controller ------------ */ 

const { 
    createPermission,
} = require('./../app/controller/api/PermissionController')

router.post(
    '/permission/create', 
    [ authenticateToken ],
    createPermission
)

/* ------------ User Controller ------------ */ 

const { 
    userList,
    userUpdate,
    userDelete
} = require('./../app/controller/api/UserController')

router.get(
    '/user/list', 
    [ authenticateToken, authorize ],
    userList
)

router.put(
    '/user/update', 
    [ authenticateToken, authorize ],
    userUpdate
)

router.delete(
    '/user/delete', 
    [ authenticateToken, authorize ],
    userDelete
)

/* ------------ Post Controller ------------ */ 

const { 
    postList,
    createPost
} = require('./../app/controller/api/PostController')

router.get(
    '/post/list', 
    [ authenticateToken, authorize ],
    postList
)

router.post(
    '/post/create', 
    [ authenticateToken, authorize ],
    createPost
)

/* ------------ Comments Controller ------------ */ 

const { 
    commentList,
    createComment
} = require('./../app/controller/api/CommentController')

router.get(
    '/comment/list', 
    [ authenticateToken, authorize ],
    commentList
)

router.post(
    '/comment/create', 
    [ authenticateToken ],
    createComment
)

module.exports = router