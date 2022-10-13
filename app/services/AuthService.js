const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const { checkPassword } = require('../middleware/auth')

const User = require('./../model/User')
const mailer = require('./../helper/mailer')
const { ObjectId } = require('mongodb')

async function register(req, res) {

    try {

        const { name, email, password } = req.body
    
        const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const register = await User.create({
            name: name, 
            email: email, 
            password: pass,
            role_id: new ObjectId('633c451264ea5bce8d60dece')
        })

        let link = `${process.env.APP_BASE_PATH}`;

        var html = fs.readFileSync(process.cwd() + '/views/emails/user-registration.ejs').toString();
        
        html = html.replace('{{NAME}}', name);
        html = html.replace('{{URL}}', link);

            // Send confirmation email
            await mailer.send(
                process.env.FROM_EMAIL,
                email,
                "User Registered",
                html
            );

        return { error: 0, success: 'User registered successfully.' }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

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

        // console.log(req.session)

        return { error: 0, message: 'Login Successfull' }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function forgetPassword(req) {
    try {

        const email = req.body.email;

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

            // Html email body
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

            return {
                error: 0, success: 'We have e-mailed your password reset link!. Please also check Junk/Spam folder as well.!'
            }
        } else {
            return {
                error: 1, message: 'Email does not exist.'
            }
        }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function resetPasswordView(req, res) {
    
    try {

        let buff = new Buffer(req.params.email, 'base64');
        let email = buff.toString('ascii');

        const rec = await User.findOne({
            where: {
                email: email,
                token: req.params.token
            }
        })

        if (rec) {
            return {
                email: email,
                val: req.params.val
            };

        } else {
            return {
                error: 1, message: "Link has been expired, Please select forgot password again."
            }
        }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function resetPassword(req, res) {

    try {
        
        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        
        if (user) {
            
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(req.body.password, salt)

            await User.updateOne(
                { email: req.body.email },
                { password: hash } 
            )

            await User.updateOne(
                { email: req.body.email },
                { token: null } 
            )

            return {
                error: 0, 
                success: "Password reset successfully. Please enter your credentials and login"
            }

        } else {

            return {
                error: 1, message: "Email does not exist."
            }
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
};