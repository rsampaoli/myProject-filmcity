const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ramirosampaoli@gmail.com",
        pass: "yhwz jacf ippq jimw",
    },
});

module.exports = transporter;