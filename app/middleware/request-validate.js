const { check, validationResult } = require('express-validator')
const User = require('./../model/User')

/**
 * Validates register request
*/
exports.register = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is not valid')
        .custom(async value => {
            let user = await User.findOne({ email: value })
            if (user) {
                return Promise.reject('Email already exist');
            }
        }),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required'),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ error: 1, errors: errors.array() })
        } else {
            next()
        }
    }
]

/**
 * Validates login request
*/
exports.login = [
    check('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is not valid')
        .custom(async value => {
            let user = await User.findOne({ email: value })
            if (!user) {
                return Promise.reject('Email not exist');
            }
        }),
    check('password')
        .exists()
        .withMessage('Password is required')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 chars long'),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({ error: 1, errors: errors.array() })
        } else {
            next()
        }
    }
]