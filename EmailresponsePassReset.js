const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: "visha770099@gmail.com",
        pass: "egnk mume ewca ilux" 
    }
});

const sendOtp = (Email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: Email,                    
        subject: 'Your password reset successfully',     
        text: `Password reset successfully \n\n Your password has been changed successfully on ${Date.now()} \n\nNote:- Do not share your password with any one\n if this is not you please inform to our technical team \n\n technical team gmail :- techteam123@gmail.com`   // Plain text body
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Email sent: ${info.response}`);
            return info;
        })
        .catch(error => {
            console.error(`Failed to send email: ${error.message}`);
            throw error;
        });
};

module.exports = sendOtp;
