const nodemailer = require("nodemailer");
const { reg_email, reg_email_password } = require("./keys");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: reg_email,
    pass: reg_email_password,
  },
});

// console.log(transporter.options.auth.user);

module.exports = transporter;
