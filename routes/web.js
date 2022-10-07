const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

const { 
    home 
} = require('./../app/controller/HomeController')


router.get('/', (req, res) => {
    res.redirect('/home')
})

router.get('/home', home)


module.exports = router