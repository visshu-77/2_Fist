const mongoose = require("mongoose");
const userModel = require("../models/user_model");

const profileSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "registers"
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    user_Email : {
        type : String,
        required : true
    },
    your_age : {
        type : Number,
        required : true
    },
    phone_number : {
        type : Number,
        required : true
    },
    mailing_address : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    identity_proof : {
        type : Buffer,
        required : true
    },
    avtar : {
        type : Buffer,
        required : true
    }
});

module.exports = mongoose.model("2fist_profile",profileSchema);