const authService = require('./../services/AuthService')
const { StatusCodes } = require('http-status-codes')

exports.getregister = async (req, res) => {
    res.render('auth/register', { success: req.flash('success'), message: req.flash('message') });
}

exports.register = async (req, res) => {
    
    try {

        const { name, email, password } = req.body

        let result = await authService.register({ name, email, password })

        if (result.error == 1) { 
            req.flash('message', result.message)
        } else {
            req.flash('success', result.message)
        }
        
        res.redirect("/register")
    } catch(error) {
        res.render('errors/500', { message: error.message })
    }
}

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

        const { email, password } = req.body

        let result = await authService.login({ email, password })
        if (result.error == 1) {

            req.flash('message', result.message)
            res.redirect("/login")
        } else {

            req.session.user_id = result.payload.user.id
            req.session.name = result.payload.user.name
            req.session.email = result.payload.user.email
            req.session.image = result.payload.user.image
    
            req.app.locals.admin = result.payload.user
            req.app.locals.fields = ''

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

exports.forgetPasswordView = async (req, res) => {
    res.render('auth/forget-password', { message: req.flash('message'), success: req.flash('success') }) 
}

exports.forgetPasswordPost = async (req, res) => {

    const email = req.body.email

    let result = await authService.forgetPassword({ email })
    
    if (result.error == 1) {
        req.flash('message', result.message);
        res.redirect("/forget-password");
    } else {
        req.flash('success', result.success);
        res.redirect("/forget-password");
    }
}

// Reset Password View
exports.resetPasswordView = async (req, res ) => {

    const { email, token, val } = req.params

    let value = val
    let result = await authService.resetPasswordView({ email, token, value })
    if (result.error == 1) {

        req.flash('message',result.message);
        res.redirect("/forget-password");
    } else {

        res.render('auth/reset-password',{ email : result.email, val: result.val });
    }
}

// Reset Password View
exports.resetPassword = async (req, res) => {

    const { email, password } = req.body

    let result = await authService.resetPassword({ email, password })
    if (result.error == 1) {

        req.flash('message', result.message)
        return res.redirect('auth/reset-password', { email: result.email })
    } else {

        if (req.body.val == 0) {

            req.flash('success', result.success)
            return res.redirect("/login")
        } else {
            
            return res.redirect("/reset-password/success")
        }
    }
}

exports.resetPasswordSuccess = async (req, res) => {
    return res.render('auth/success');
}