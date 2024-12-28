const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user_model");
const sendOtp = require("../middlewares/sendotp");
const validPhoneNumber = require('.././middlewares/phoneNumber');

const register = async(req,res)=>{
    try{
        const { Your_name,
            Email_Address,
            Number,
            Password,
            confirm_Password,
        } = req.body;

        //validation for all details
        if(!(Your_name && Email_Address && Number && Password && confirm_Password)){
            return res.status(400).json({result:"false",msg:"details are required - Your_name, Email_Address, Number, Password, confirm_Password"})
        }

        //validation for phone number
        const existingData = await userModel.findOne({Number});
        if(existingData){
            return res.status(400).json({result:"false",msg:"Phone number is already registered"});
        }
        //validation for email 
        const existingDataa = await userModel.findOne({Email_Address});
        if(existingDataa){
            return res.status(400).json({result:"false",msg:"Email is already registered"});
        }
        
        //validation for password and confirm password
        if(Password !== confirm_Password){
            return res.status(400).json({result:"false",msg:"password does not match with confirm_password"});
        }

        const phoneNumberValidation = validPhoneNumber.validation(Number);
        if(!(phoneNumberValidation.valid)){
            return res.status(400).json({result:"false",msg:phoneNumberValidation.msg});
        }

        //function for password authentication
        function validPassword(Password){
            const minLength = 6;
            const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;

            if(Password.length < minLength){
                return { valid: false, msg: "Password length should be at least 6 characters long" };
            }
            if (!regex.test(Password)) {
                return { valid: false, msg: "Password must be strong - contain at least 1 uppercase, 1 special symbol, and 1 number, e.g., Jhon@1234" };
            }
            return { valid: true };
        }
        //function call
        const passwordValidation = validPassword(Password);
        if(!(passwordValidation.valid)){
            return res.status(400).json({result:"false",msg:passwordValidation.msg});
        }

        //generate the otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`Generated OTP: ${otp}`);

        //check email is correct or not
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email_Address);
        if(!isValidEmail){
            return res.status(400).json({result:"false",msg:"Invalid Email address"})
        }
        try{
            await sendOtp(Email_Address,otp)
        }catch(err){
            return res.status(500).json({ result: "false", msg: "Failed to send OTP to email" });
        }

        const secure_pass = await bcrypt.hash(Password,10);
        const data = new userModel({
            Your_name,
            Email_Address,
            Number,
            Password:secure_pass,
    });
        const insertData = await data.save();
        if(!insertData){
            return res.status(400).json({result:"false",msg:"signup unsuccessfull"});
        }
        return res.status(200).json({result:"true",msg:"Signup Successfully"});

    }catch(err){
        console.log(err)
        res.status(500).json({result:"False",msg:"Internal server error"});
    }
};

const login = async(req,res)=>{
    try{
        const { 
            Email_Address,
            Password
        } = req.body;

        if(!(Email_Address && Password)){
            return res.status(400).json({result:"false",msg:"Email and password is required for login"});
        }

        const checkEmail = await userModel.findOne({Email_Address});
        if(!checkEmail){
            return res.status(400).json({result:"false",msg:"Email is incorrect"});
        }

        const matchPassword = await bcrypt.compare(Password,checkEmail.Password);
        if(!matchPassword){
            return res.status(400).json({result:"false",msg:"password is incorrect"})
        }
        if(checkEmail.isBlocekd){
            return res.status(400).json({result:"false",msg:"You are now blocked you cannot login with our website"})
        }
        const SECRET_KEY = "qwertyuiopasdfghjklzxcvbnm"
		const token = jwt.sign({
			userId : checkEmail._id,
			Email_Address  : checkEmail.Email_Address,
		  }, SECRET_KEY, { expiresIn: "20d" });

        return res.status(200).json({result:"true",msg:"Login successfull",Token:token});

    }catch(err){
        console.log(err)
        res.status(500).json({result:"false",msg:"Internal server error"})
    }
};

module.exports = {
    register,
    login,
};