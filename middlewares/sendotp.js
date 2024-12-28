const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'visha770099@gmail.com', 
        pass: 'egnk mume ewca ilux'  
    }
});

const sendotp = (Email_Address, otp) => {
    const mailOptions = {
        from: 'Amazon', 
        to: Email_Address,      
        subject: 'Your OTP Code for verification',
        text: `Your OTP is: ${otp}`   
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

module.exports = sendotp;
