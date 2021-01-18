const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const template = "email.ejs";

const sendLink = async (email_id, link = "") => {
    let subject = "Email Verification";
    await main(email_id, link, subject).catch(console.error);
};

const main = async (email_id, link, subject) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    console.log(path.join(__dirname, `../views/${template}`));

    ejs.renderFile(
        path.join(__dirname, `../views/${template}`),
        { link: link },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let mailOptions = {
                    from: process.env.EMAIL,
                    to: email_id,
                    subject: subject,
                    // text: message,
                    html: data,
                };

                console.log("Sending ,mail ======================>");
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(
                            `Message sent:  ${info.response} to  ${email}`
                        );
                    }
                });
            }
        }
    );
};

module.exports = {
    sendLink,
};
