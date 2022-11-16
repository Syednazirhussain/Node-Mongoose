const bcrypt = require('bcrypt');

const authenticateUser = async (req, res, next) => {

    try {

        // console.log(req.session);
        if (req.session.email === undefined || req.session.email === null) {
            res.redirect('/login')
        } else {
            next()
        }
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = {
    authenticateUser
}
