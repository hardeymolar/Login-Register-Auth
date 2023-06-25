require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const userOtpVerfication = require('../models/userOtp.verification');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
const createOTP = async (email)=>{
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp,saltRounds);
    const newOptVerification = await userOtpVerfication.create({
        userId: email,
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 300000, 
    })
    return otp;
}


// const verifyNewUser = (email) => {
//     transporter.sendMail({
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'User Verification Successful',
//         html: `you just created an account with next-talents-jobs`
//     }, (error, info) => {
//         if (error) {
//             console.log('Error occurred:', error.message);
//         } else {
//             console.log('Email sent successfully!');
//         }
//     });
// }
const sendOtpVerificationEmail = async ( {_id, email }, res) => {
    const otp = await createOTP(email)
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: ' Verify your Email',
        html: `<p>enter <b>${otp}</b> in the app to verify your email address and complete the process</p></br>
        <p>This code <b> expires in 5 minutes</b></p>`
    }, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
        } else {
            console.log('Email sent successfully!');
        }
    });
    res.json({
        status:"PENDING",
        Message:"verification otp sent",
        Data:{
            userId: _id,
            email:email
        }
    })
}
const resendOtpVerificationCode = async (req, res) => {
    try {
        let { email, userId } = req.body;
        if (!email || !userId) {
            throw new Error("empty user details are not allowed");
        } else {
            await userOtpVerification.deleteMany({ userId });
            await sendOtpVerificationEmail({ _id: userId, email }, res);
        }
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = { sendOtpVerificationEmail, resendOtpVerificationCode }