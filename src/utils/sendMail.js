const nodemailer = require('nodemailer');

async function sendEmail({ from, to, subject, text }) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  let mailOptions = {
    from: from, 
    to: to, 
    subject: subject, 
    text: text, 
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

module.exports = sendEmail;