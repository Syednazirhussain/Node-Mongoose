const fs = require('fs');

const mailer = require("./../helper/mailer");

const sendUserRegisterationEmail = async ({ name, email }) => {

    // Read File 
    let html = fs.readFileSync(process.cwd()+'/views/emails/user-registration.ejs').toString();

    // Replace variable
    html = html.replace('{{NAME}}', name);
    html = html.replace('{{URL}}', process.env.APP_BASE_PATH);

    // Send Email
    await mailer.send(
        process.env.FROM_EMAIL,
        email,
        "User Registered",
        html
    );
}

module.exports = {
    sendUserRegisterationEmail
}