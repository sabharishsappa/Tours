const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // creating Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // activating in gmail less secure option as 500 limit more than 500 it automatically detects as a spam
  });

  // Defining Email options
  const mailOptions = {
    from: 'Sabharish <sabharish@gmail.com>',
    to: options.email,
    text: options.message,
    subject: options.subject,
    // html:
  };

  // sending email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
