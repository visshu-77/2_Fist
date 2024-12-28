const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    Your_Name : {
        type : String,
        required : true
    },
    Your_Email : {
        type : String,
        required : true
    },
    Your_PhoneNumber : {
        type : Number,
        required : true
    },
    comments : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Contact-us",contactSchema);