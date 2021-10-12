const nodemailer = require("nodemailer");

const username = 'bjergocean@gmail.com'
const password = 'Daiduong_1'
  // create reusable transporter object using the default SMTP transport
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: username,
        pass: password
    }
});

const sendWelcomeEmail = (email, name) => {
    const mailDetails = {
        from: 'bjergocean@gmail.com',
        to: 'bjergocean@gmail.com',
        subject: 'Thanks for joining in',
        text: `welcome to the app, ${name}. Let me know how you get along with the app`
    }
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

const sendCancelEmail = ((email, name) => {
    const mailDetails = {
        from: 'bjergocean@gmail.com',
        to: 'bjergocean@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. hope to see you back soon`
    }
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
})

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
  






