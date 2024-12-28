const contactModel = require("../models/contact");
const userModel = require("../models/user_model");
const sendEmailResponse = require("../sendEmailResponse");
const validPhoneNumber = require('.././middlewares/phoneNumber');

const contact = async(req,res) => {
    try{
        const{ id } =req.params;

        const { 
            Your_Name,
            Your_Email,
            Your_PhoneNumber,
            comments
        } = req.body;

        if(!(Your_Name && Your_Email && Your_PhoneNumber && comments)){
            return res.status(400).json({result:"false",msg:"All details are required - Your_Name, Your_Email, Your_PhoneNumber, comments"})
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Your_Email);
        if(!isValidEmail){
            return res.status(400).json({result:"fasle",msg:"Invalid Email address"});
        }
        
        //function call
        const phoneNumberValidation = validPhoneNumber.validation(Your_PhoneNumber);
        if(!(phoneNumberValidation.valid)){
            return res.status(400).json({result:"false",msg:phoneNumberValidation.msg});
        }

        // const existingData = await contactModel.findOne({_id : id});
        const user = await userModel.findById(id);
        if(!user){
            return res.status(400).json({result : "false" , msg : "User not found"});
        }

        const existingData = await contactModel.findOne({ Your_Email })
        if(existingData){
            existingData.Your_Name = Your_Name;
            existingData.Your_Email = Your_Email;
            existingData.Your_PhoneNumber = Your_PhoneNumber;
            existingData.comments = comments;

            const updatedata = await existingData.save();
            
            if(!updatedata){
                return res.status(400).json({result:"false",msg:"Failed to update"});
            }

            try{
                await sendEmailResponse(Your_Email,Your_Name);
            }catch(err){
                res.status(400).json({result:"false",msg:"Failed to send response"});
            }

            return res.status(200).json({result:"True",msg:"update successfully"});
        }
        else {
        const data = new contactModel({
            Your_Name,
            Your_Email,
            Your_PhoneNumber,
            comments
        });
        const insrtdata = await data.save();

        if(!insrtdata){
            return res.status(400).json({result:"false",msg:"feedback not send due to some reason"});
        }

        try{
            await sendEmailResponse(Your_Email,Your_Name);
        }catch(err){
            console.log(err)    
            return res.status(400).json({result:"false",msg:"Failed to send response"});
        }

        return res.status(200).json({result:"true",msg:"Response send succesfully....our team reach soon.!"});
    }
    }catch(err){
        console.log(err )
        res.status(500).json({result:"false",msg:"Internal Server error"});
    }
};

const showUser = async(req,res) => {
    try{
        const show = await userModel.find();
        return res.status(200).json(show);
    }catch(err){
        res.status(500).json({result:"false",msg:"Internal Server Error"});
    }
};

const blockUser = async(req,res)=>{
    try{
        const { id } = req.params;
        const { action } = req.body;

        if(action !== "block" && action !== "unblock"){
        return res.status(400).json({result:"false",msg:"Invalid action"})
        }
        const update = action == "block" ? { isBlocked : true} : { isBlocked : false};
        const user = await userModel.findByIdAndUpdate(
            id,
            update,
            { new : true} ,
        );
        if(!user){
            return res.status(400).json({result:"false",msg:"User not found"});
        }
        return res.status(200).json({result:"true",msg: `${action}ed successfully`});
    }catch(err){
        console.log(err)
        res.status(500).json({result:"False",msg:"Internal server error"});
    }
};



module.exports = {
    contact,
    showUser,
    blockUser,
}