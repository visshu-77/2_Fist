const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
    Email : {
        type : String,
        required : true
    },
    otp : {
        type : Number,
        required : true
    },
    expiresAt : {
        type : Date,
        required : true
    }
});

otpSchema.index({expiresAt:1}, {expireAfterSeconds:0})

module.exports = mongoose.model("otp",otpSchema);