const multer = require('multer')
const path = require('path');
const utility = require("../helper/utility");

// handle storage using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${utility.randomNumber(5)}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var fileFilter = function (req, file, cb)  {
    var allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb({
            success: false,
            message: 'Invalid file type. Only jpg, png image files are allowed.'
        },false);
    }
};

var upload = multer({
    storage: storage,
    limits:{
        fileSize : 1024 * 1024 *5
    },
    fileFilter : fileFilter
});
module.exports = upload;