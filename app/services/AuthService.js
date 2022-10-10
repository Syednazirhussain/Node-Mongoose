const User = require('./../model/User')

async function login(req) {

    try {

        const { email, password } = req.body
    
        const userExist = await User.findOne({
            where: {
                email: email
            }
        })

        if (!userExist) {
            return { error: 1, message: 'Email not exist' }
        }

        let isMatch = await userExist.comparePassword(password)

        if (!isMatch) {
            return { error: 1, message: 'Invalid password' }
        }

        req.session.user_id = userExist.id
        req.session.name = userExist.name
        req.session.email = userExist.email

        console.log(req.session)

        return { error: 0, message: 'Login Successfull' }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

module.exports = {
    login,
};