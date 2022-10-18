const { pushNotification } = require('./../helper/fcm')

exports.home = (req, res) => {

    try {

        req.app.locals.fields = ''
        
        pushNotification({
            subject: 'My First Notification',
            meesage: 'This is from NodeJS project',
            devices: [],
            refid: '',
            click_action: ''
        })

        var mascots = [
            { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
            { name: 'Tux', organization: "Linux", birth_year: 1996 },
            { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
        ]

        var tagline = "No programming concept is complete without a cute animal mascot."
                
        res.render('index', {
            mascots: mascots,
            tagline: tagline
        })
    } catch (error) {

        res.render('errors/500', { message: error.message })
    }
}