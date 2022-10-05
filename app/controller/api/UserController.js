const { StatusCodes } = require('http-status-codes')

const User = require('./../../model/User')

const userList = async (req, res) => {
    
    try {

        let  users = await User.find({})
        
        res.json({ error: 0, payload: users })
    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}

const userUpdate = async (req, res) => {
    
    try {

        console.log(req.query.id);

        const { name, email, role_id } = req.body

        let data = {
            name: name,
            email: email,
            role_id: role_id
        }

        console.log(data);

        await User.findByIdAndUpdate(
            { _id: req.query.id }, 
            data, 
            { new: true, runValidators: true }
        )

        if (!job) {
            throw new NotFoundError(`No job with id ${jobId}`)
        }
        
        res.status(StatusCodes.OK).json({ job })


    } catch (error) {
        res.json({ error: 1, message: error.message })
    }
}



module.exports = {
    userList,
    userUpdate
}