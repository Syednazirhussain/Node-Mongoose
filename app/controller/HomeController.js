
exports.home = (req, res) => {

    try {
        
        var mascots = [
            { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
            { name: 'Tux', organization: "Linux", birth_year: 1996 },
            { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
        ]

        var tagline = "No programming concept is complete without a cute animal mascot."
                
        res.render('index', {
            mascots: mascots,
            tagline: tagline,
            name: req.session.name,
            image: req.session.image
        })
    } catch (error) {

        res.render('errors/500', { message: error.message })
    }
}