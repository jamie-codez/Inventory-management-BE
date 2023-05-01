const mailer = require("nodemailer");

const randomAlphaNumeric = () => {
    return Math.random().toString(36).slice(2);
}

const sendMail = async (from, to, subject, text, html) => {
    const testAccount = await mailer.createTestAccount();
    const transporter = mailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
    const info = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    await transporter.sendMail(info)
        .then(value => {
            console.log(value.response);
        }).catch(error => {
            console.error(error);
        })
};

module.exports = { randomAlphaNumeric, sendMail };