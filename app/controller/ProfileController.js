const profileService = require('../services/ProfileService')
const { StatusCodes } = require('http-status-codes')

exports.edit = async (req, res) => {

    try {
        let edit = await profileService.edit(req)

        if (edit.error == 1) { 
            res.redirect("/")
        } else {
            res.status(StatusCodes.OK).render('profile/edit', { user: edit.user, name: req.session.name, image: req.session.image, success: req.flash('success'), message: req.flash('message') });
        }

    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}

exports.update = async (req, res) => {

    try {

        console.log(req.files)

        req.body.image = req.files[0]
        let update = await profileService.update(req)

        if (update.error == 1) { 
            req.flash("error", update.message)
        } else {
            req.flash("success", update.message)
        }
        
        res.redirect("/editProfile")
    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }

}