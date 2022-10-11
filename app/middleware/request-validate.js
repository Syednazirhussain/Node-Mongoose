const { check, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
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
        .bail()
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
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 chars long'),
    check('confirmpassword')
        .not()
        .isEmpty()
        .withMessage('Confirm Password is required')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Confirm Password must be at least 5 chars long')
        .custom(async (confirmpassword, { req }) => {
            const password = req.body.password
            if (password != confirmpassword) {
                return Promise.reject('Password and Confirm password does not match.');
            }   
        }),
        (req, res, next) => {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req)
            
            if (errors.isEmpty()) {
                
                next()
            } else {
    
                if (req.xhr || req.is('*/json')) {
                    res.json({ error: 1, errors: errors.array() })
                } else {
                    console.log(errors.array());
                    let backURL = req.header('Referer') || '/'           
                    req.flash('error', errors.array())
                    res.redirect(backURL)
                }
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
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 chars long'),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req)
        
        if (errors.isEmpty()) {
            
            next()
        } else {

            if (req.xhr || req.is('*/json')) {
                res.json({ error: 1, errors: errors.array() })
            } else {
                console.log(errors.array());
                let backURL = req.header('Referer') || '/'           
                req.flash('error', errors.array())
                res.redirect(backURL)
            }
        }
    }
]