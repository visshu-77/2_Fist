const userModel = require("../models/user_model");
const otpModel = require("../models/otpModel");
const profileModel = require("../models/profile");
const bcrypt = require("bcryptjs");
const sendOtp = require("../middlewares/sendotp");
const sendResponse = require("../EmailresponsePassReset");
const { deleteModel } = require("mongoose");

const fogotpassword = async(req,res)=>{
    try{
        const { Email } = req.body;
        if(!Email){
            return res.status(400).json({resul:"false",msg:"Email is required for forgot the password"});
        }
        const user = await userModel.findOne({ Email_Address:Email });
        if(!user){
            return res.status(400).json({resul:"false",msg:"User not found"});
        }
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);
        if(!isValidEmail){
            return res.status(400).json({resul:"false",msg:"Email address is incorrect"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const otpDoc = new otpModel({
            Email,
            otp,
            expiresAt
        });
        await otpDoc.save();
        try{
            await sendOtp(Email,otp);
        }catch(err){
            return res.status(400).json({resul:"false",msg:"otp send failed"});
        }
        return res.status(200).json({result:"true",msg:"otp send successfully please verify your email"});
    }catch(err){
        console.log(err)
        res.status(500).json({result:"false",msg:"Internal server error"});
    }
};

const verifyOtpForPasswwordChange = async(req,res)=>{
    try{
        const { 
            Email,
            otp,
            newPassword,
            confirmPassword, 
        } = req.body;
        if(!Email && otp && newPassword && confirmPassword){
            return res.status(400).json({result:"false",msg:"Email, otp , newPassword & confirmPassword is required"});
        }

        function validPassword(newPassword){
            const minLength = 6;
            const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;

            if(newPassword < minLength){
                return res.status(400).json({result:"false",msg:"New password should be 6 character"})
            }
            if (!regex.test(newPassword)) {
                return { valid: false, msg: "New Password must be strong - contain at least 1 uppercase, 1 special symbol, and 1 number, e.g., Jhon@1234" };
            }
            return { valid: true };
        }
        const passwordValidation = validPassword(newPassword);
        if(!(passwordValidation.valid)){
            return res.status(400).json({result:"false",msg:passwordValidation.msg});
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({result:"false",msg:"password and confirm password does not match"});
        }

        const otpData = await otpModel.findOne({Email,otp});
        if(!otpData){
            return res.status(400).json({result:"false",msg:"Invalid otp or expired"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        await userModel.updateOne(
            {Email_Address:Email},
            {password : hashedPassword},
        )

        await otpModel.deleteOne({
            _id : otpData.id
        });
        try{
            await sendResponse(Email);
            return res.status(200).json({result:"false",msg:"Password reset successfully"});
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
        res.status(500).json({result:"false",msg:"Internal server error"})
    }
};

const changePassword = async(req,res)=>{
    try{
        const { 
            id
        } = req.params;
        const {
            Current_Password,
            new_Password,
            confirm_Password
        } = req.body;

        if(!(Current_Password && new_Password && confirm_Password)){
            return res.status(400).json({result:"false",msg:"old_Password, new_Password, confirm_Password is required"})
        }

        function validPassword(new_Password){
            const minLength = 6;
            const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;

            if(new_Password < minLength){
                return res.status(400).json({result:"false",msg:"New password should be 6 character"})
            }
            if (!regex.test(new_Password)) {
                return { valid: false, msg: "New Password must be strong - contain at least 1 uppercase, 1 special symbol, and 1 number, e.g., Jhon@1234" };
            }
            return { valid: true };
        }

        const passwordValidation = validPassword(new_Password);
        if(!(passwordValidation.valid)){
            return res.status(400).json({result:"false",msg:passwordValidation.msg});
        }

        if(new_Password !== confirm_Password){
            return res.status(400).json({result:"false",msg:"new password and confirm password is not match"});
        }

        const user = await userModel.findById(id);
        if(!user){
            return res.status(400).json({result:"false",msg:"User not found"})
        }

        const isMatch = await bcrypt.compare(Current_Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ result: "false", msg: "Current password does not match" });
        }

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(new_Password, salt);
        await user.save();
        
        return res.status(200).json({result:"true",msg:"password change successfully"});

    }catch(err){
        console.log(err)
        res.status(500).json({result:"false",msg:"Internal server error"})
    }
};

const addFund = async(req,res)=>{
    try{
        const { id } = req.params;
        const{ Enter_fund } = req.body;

        if(!Enter_fund) {
            return res.status(400).json({result:"false",msg:"Fund is required for add fund"});
        }
        const fund = parseInt(Enter_fund);

        const user = await userModel.findById(id);
        if(!user){
            return res.status(400).json({result:"false",msg:"user not found"});
        }
        if(Enter_fund <= 0 || /^[a-zA-Z]+$/.test(Enter_fund)){
            return res.status(400).json({result:"false",msg:"Fund value is incorrect"})
        }
        const data = await userModel.findByIdAndUpdate(
            id,
            {Enter_fund:fund},
            { new : true },
        );
        if(!data){
            return res.status(400).json({result:"false",msg:"Fund not added"});
        }
        return res.status(200).json({result:"true",msg:"Fund added successfully"});
    }catch(err){
        console.log(err)
        res.status(500).json({result:"false",msg:"Internal server error"});
    }
};

const profile = async(req,res)=>{
    try{
        // const { userId } = req.params;
        const {
            username,
            user_Email,
            your_age,
            phone_number,
            mailing_address,
            pincode,
            country,
            city,
            state,
            identity_proof,
            avtar,
        } = req.body;

        // if(!(username && user_Email && your_age && phone_number && mailing_address && pincode && country && city && state)){
        //     return res.status(400).json({result:"false",msg:"All details are required - username, user_Email, your_age, phone_number, mailing_address, pincode, country, city, state, identity_proof, avtar"})
        // }



        const data = new profileModel({
            username,
            user_Email,
            your_age,
            phone_number,
            mailing_address,
            pincode,
            country,
            city,
            state,
            identity_proof,
            avtar,
        });
        const datta = await data.save();
        if(!datta){
            return res.status(400).json({result:"false",msg:"profile not added"});
        }
        return res.status(200).json({result:"true",msg:"profile added successfully"})
    }catch(err){
        console.log(err)
        return res.status(500).json({result:"false",msg:"internal server error"});
    }
};


module.exports = {
    fogotpassword,
    verifyOtpForPasswwordChange,
    changePassword,
    addFund,
    profile,

};