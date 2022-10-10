const authService = require('./../services/AuthService')
const { StatusCodes } = require('http-status-codes')

exports.login = async (req, res) => {

    try {

        if (req.session.email === undefined || req.session.email === null) {

            res.status(StatusCodes.OK).render('auth/login')
        } else {
            
            res.redirect('/home')
        }

    } catch (error) {

        res.render('errors/500', { message: error.message })
    }
}

exports.loginAttempt = async (req, res) => {

    try {

        let result = await authService.login(req)

        console.log(result);

        if (result.error == 1) {

            req.flash('message', result.message)
            res.redirect("/login")
        } else {

            req.flash('info', 'Logged In Successfully.')
            res.redirect("/home")
        }

    } catch (error) {

        res.render('errors/500', { message: error.message })
    }
}

exports.logout = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect('/login')
    } catch (error) {

        handleError(res, error)
    }
}