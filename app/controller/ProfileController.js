const profileService = require('../services/ProfileService')
const { StatusCodes } = require('http-status-codes')

exports.edit = async (req, res) => {

    try {
        let edit = await profileService.edit(req)

        if (edit.error == 1) { 
            res.redirect("/")
        } else {
            res.render('profile/edit', { user: edit.user, name: req.session.name, image: req.session.image, success: req.flash('success'), message: req.flash('message') });
        }

    } catch(error) {
        res.render('errors/500', { message: error.message })
    }

}

exports.update = async (req, res) => {

    try {
        req.body.image = req.file;

        let update = await profileService.update(req)

        if (update.error == 1) { 
            res.redirect("/editProfile")
        } else {
            req.flash("success", update.success);
            req.flash("message", update.message);
            res.redirect('/editProfile');
        }

    } catch(error) {
        res.render('errors/500', { message: error.message })
    }

}