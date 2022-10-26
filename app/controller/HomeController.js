const uuid = require("uuid")
const { StatusCodes } = require('http-status-codes')
const { MongoClient, ObjectId } = require('mongodb')

const { pushNotification } = require('./../helper/fcm')

const url = process.env.DB_URI
const client = new MongoClient(url, {
    useUnifiedTopology: true
})

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

exports.AddBulkRecords = async (req, res) => {
    try {
        
        let persons = await client.db("node-mongoose")
                                .collection('persons')
                                .find({})
                                .toArray()

        let device_type = ['chrome', 'android']

        persons.forEach(async (person, index) => {

            let device_obj = {
                device_token: uuid.v4(),
                device_type: device_type[Math.floor(Math.random() * 2)] 
            }

            // Add newly created array of object in person object
            /* 
            let isUpdated = await client.db('node-mongoose')
                                        .collection('persons')
                                        .updateOne(
                                            { _id: person._id },
                                            { 
                                                $set: {
                                                    device_token: [ device_obj ]
                                                } 
                                            }
                                        )
            */

            // Push array of object in person object
            let isUpdated = await client.db('node-mongoose')
                                        .collection('persons')
                                        .updateOne(
                                            { _id: person._id },
                                            { 
                                                $push: {
                                                    device_token: device_obj 
                                                } 
                                            }
                                        )
            

            console.log(isUpdated)
        })

        req.flash('success', 'Persons records retrive successfully')
        res.status(StatusCodes.OK).redirect('/home')

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
    }
}