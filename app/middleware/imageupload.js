const path = require('path')
const multer = require('multer')

const utility = require("../helper/utility")

// handle storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${utility.randomNumber(5)}-${Date.now()}${path.extname(file.originalname)}`);
    }
})

const fileFilter = (req, file, cb) => {

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb({
            success: false,
            message: 'Invalid file type. Only jpg, png image files are allowed.'
        }, false)
    }
}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

module.exports = upload