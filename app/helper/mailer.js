const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	secure: false, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	}
});

exports.send = async function (from, to, subject, html, attachments = [])
{
	if (attachments.length == 0) {

		// send mail with defined transport object
		// visit https://nodemailer.com/ for more options
		return await transporter.sendMail({
			from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
			to: to, // list of receivers e.g. bar@example.com, baz@example.com
			subject: subject, // Subject line e.g. 'Hello ✔'
			//text: text, // plain text body e.g. Hello world?
			html: html // html body e.g. '<b>Hello world?</b>'
		});
	} else {
		return await transporter.sendMail({
			from: from,
			to: to,
			subject: subject,
			html: html,
			attachments: attachments
		})
	}
};