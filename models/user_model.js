const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    Your_name : {
        type : String,
        required : true
    },
    Email_Address : {
        type : String,
        required : true
    },
    Number : {
        type : Number,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    Enter_fund : {
        type : Number
    },
    otp : {
        type : Number
    }
});

module.exports = mongoose.model("register",registerSchema);