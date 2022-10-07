
exports.home = (req, res) => {

    try {

        // throw new Error("Abu arahe hain")

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