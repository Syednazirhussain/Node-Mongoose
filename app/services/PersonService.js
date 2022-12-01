const fs = require("fs")
const pdf = require("pdf-creator-node")

const mailer = require('./../helper/mailer')

const emailPersonCSV = async (personArr, user) => {

    try {

        // Read HTML Template
        let html = fs.readFileSync("./views/person/person.html", "utf8")

        let options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "45mm",
                contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            },
            footer: {
                height: "28mm",
                contents: {
                    first: 'Cover page',
                    2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            }
        };

        let document = {
            html: html,
            data: {
            persons: personArr,
            },
            path: "./views/person/persons.pdf",
            type: "",
        };
        // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

        /*
        pdf
        .create(document, options)
        .then(async (res) => {

            let attachments = [{ filename: 'person-list.pdf', path: res.filename }]

            let html = fs.readFileSync(process.cwd() + '/views/emails/persons/list.ejs').toString()
            html = html.replace('{{NAME}}', user.name)
    
            await mailer.send(
                process.env.FROM_EMAIL,
                user.email,
                "Person PDF",
                html,
                attachments
            )

            return { error: 0, message: "Person pdf created successfully" }
        })
        .catch((error) => {
            return { error: 1, message: error.message }
        });
        */

        const { filename } = await pdf.create(document, options)

        let attachments = [{ filename: 'person-list.pdf', path: filename }]

        let emailHtml = fs.readFileSync(process.cwd() + '/views/emails/persons/list.ejs').toString()
        emailHtml = emailHtml.replace('{{NAME}}', user.name)

        await mailer.send(
            process.env.FROM_EMAIL,
            user.email,
            "Person PDF",
            emailHtml,
            attachments
        )

        return { error: 0, message: "Persons list has been emailed successfully." }
    } catch (error) {
        return { error: 1, message: error.message }
    }
}


module.exports = {
    emailPersonCSV
}