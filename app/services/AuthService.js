const fs = require('fs')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { ObjectId } = require('mongodb')

const User = require('./../model/User')
const mailer = require('./../helper/mailer')
const { checkPassword } = require('../middleware/auth')

const register = async ({ name, email, password }) => {

    try {

        const register = await User.create({
            name: name, 
            email: email, 
            password: password,
            role_id: new ObjectId('633c451264ea5bce8d60dece')
        })

        let link = `${process.env.APP_BASE_PATH}`

        var html = fs.readFileSync(process.cwd() + '/views/emails/user-registration.ejs').toString()
        html = html.replace('{{NAME}}', name)
        html = html.replace('{{URL}}', link)

        await mailer.send(
            process.env.FROM_EMAIL,
            email,
            "User Registered",
            html
        )

        return { error: 0, message: 'User registered successfully.' }
    } catch (error) {

        return { error: 1, message: error.message }
    }
}

const login = async ({ email, password }) => {

    try {

        const userExist = await User.findOne({ email: email })
        if (!userExist) {
            return { error: 1, message: 'Email not exist' }
        }

        let isMatch = await userExist.comparePassword(password)

        if (!isMatch) {
            return { error: 1, message: 'Invalid password' }
        }

        return { error: 0, message: 'Login Successfull', payload: { user: userExist } }
    } catch (error) {

        return { error: 1, message: error.message }
    }
}

const forgetPassword = async ({ email }) => {

    try {

        const userExist = await User.findOne({
            where: {
                email: email
            }
        })

        if (userExist) {

            let token = new Buffer(uuidv4());
            let base64Token = token.toString('base64')

            const tokenUpdate = await User.updateOne(
                { email: email },
                { token: base64Token } 
            )

            let buff = new Buffer(email);
            let base64data = buff.toString('base64');

            let link = `${process.env.APP_BASE_PATH}reset-password/${base64Token}/${base64data}/0`;

            var html = fs.readFileSync(process.cwd() + '/views/emails/reset-password.ejs').toString();
            html = html.replace('{{USERNAME}}', userExist.name);
            html = html.replace('{{LINK}}', link);

            // Send confirmation email
            await mailer.send(
                process.env.FROM_EMAIL,
                email,
                "Reset Password Link",
                html
            );

            return { error: 0, success: 'We have e-mailed your password reset link!. Please also check Junk/Spam folder as well.!' }
        } else {

            return { error: 1, message: 'Email does not exist.' }
        }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}

const resetPasswordView = async ({ email, token, value }) => {
    
    try {

        let buff = new Buffer(email, 'base64');
        let emailASCII = buff.toString('ascii');

        const rec = await User.findOne({
            where: {
                email: emailASCII,
                token: token
            }
        })

        if (rec) {

            return { email: emailASCII, val: value }
        } else {

            return { error: 1, message: "Link has been expired, Please select forgot password again." }
        }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}

const resetPassword = async ({ email, password }) => {

    try {
        
        let user = await User.findOne({
            where: {
                email: email
            }
        })
        
        if (user) {
            
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(password, salt)

            await User.updateOne(
                { email: email },
                { password: hash } 
            )

            await User.updateOne(
                { email: email },
                { token: null } 
            )

            return { error: 0, success: "Password reset successfully. Please enter your credentials and login" }
        } else {
            return { error: 1, message: "Email does not exist." }
        }

    } catch (error) {
        return { error: 1, message: error.message, email: req.body.email }
    }
}


module.exports = {
    register,
    login,
    forgetPassword,
    resetPasswordView,
    resetPassword
}