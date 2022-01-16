const nodemailer = require('nodemailer');
const config = require('../config/email');
console.log(config);
let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false,
    service: 'gmail',
    auth: {
        user: config.user,
        pass: config.pass
    },
});

const email = async(to, subject, body) => {
    console.log(`from ${config.user} to ${to}`);
    console.log(`my config is`);
    console.log(config);
    await transporter.sendMail({
        from: '"User Name" <' + config.user + '>',
        to: to, // list of receivers
        subject: subject,
        text: "Hello world",
        html: body,
    });
};

module.exports = email;