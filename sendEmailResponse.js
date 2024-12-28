const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: "visha770099@gmail.com",
        pass: "egnk mume ewca ilux" 
    }
});

const sendOtp = (Your_Email,Your_Name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: Your_Email,                    
        subject: 'Thank you for contacting us',     
        text: `Hello ${Your_Name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nYour Company`   // Plain text body
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
