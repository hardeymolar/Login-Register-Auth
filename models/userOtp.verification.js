const mongoose = require('mongoose');

const userOtpVerficationSchema = mongoose.Schema({
    userId:String,
    otp:String,
    createdAt: Date,
    expiresAt: Date
});

module.exports =  mongoose.model('userOtpVerfication',userOtpVerficationSchema);