require('dotenv').config();
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const { sendOtpVerificationEmail } = require('../utils/email');
const userOtpVerification = require('../models/userOtp.verification');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const newUser = await user.create({ ...req.body });
        await sendOtpVerificationEmail({ _id: newUser._id, email: newUser.email }, res);
    } catch (error) {
        res.json({ error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("please provide email and password");
        }
        findUser = await user.findOne({ email: email });
        if (!findUser) {
            throw new Error("user not found!")
        }
        const verifyPassword = await bcrypt.compare(password, findUser.password)
        console.log(verifyPassword);
        if (!verifyPassword) {
            throw new Error("incorrect password please try again")
        }
        const isverified = findUser.verified;
        if (!isverified) {
            throw new Error("user is not verified please check your mail to verify before login")
        }
        res.status(201).json({ userId: findUser._id, email: email, verified: true });
    } catch (error) {
        res.json(error.message);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email){
            throw new Error('please provide email')
        }
        const foundUser = await user.findOne({ email: email });
        if (!foundUser) {
            throw new Error("User not found");
        } else {
            await sendOtpVerificationEmail({ _id: foundUser._id, email }, res);
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const otpVerification = async (email, otp) => {
    if (!email || !otp) {
        throw new Error("Please enter OTP for verification");
    } else {
        const userOtpVerificationRecord = await userOtpVerification.findOne({ userId: email });
        if (!userOtpVerificationRecord) {
            throw new Error("Account record doesn't exist. Please sign up or login.");
        } else {
            const { expiresAt, otp: hashedOtp } = userOtpVerificationRecord;
            if (expiresAt < Date.now()) {
                await userOtpVerification.deleteMany({ userId: email });
                throw new Error("Code has expired. Please request again.");
            } else {
                const validOtp = await bcrypt.compare(otp, hashedOtp);
                if (!validOtp) {
                    throw new Error("invalid otp, please check and try again");
                }
                else {
                    return validOtp;
                }
            }
        }
    }
};

const verifyNewUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validOtp = await otpVerification(email, otp);
        await user.updateOne({ email: email }, { verified: true });
        await userOtpVerification.deleteMany({ userId: email });
        res.json({
            status: "VERIFIED",
            message: "User email has been verified successfully. Kindly proceed to login."
        });

    } catch (error) {
        res.json(error.message);
    }
};
const verifyOtpForForgotPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validOtp = await otpVerification(email, otp);
        await userOtpVerification.deleteMany({ userId: email });
        const token = await jwt.sign({ email }, process.env.JWTSECRET, { expiresIn: process.env.JWTLIFETIME });
        res.json({
            status: "VERIFIED",
            message: "User email has been verified successfully. Kindly proceed to reset password.",
            token: token
        });

    } catch (error) {
        res.json(error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const email = req.email
        if (!password || !confirmPassword) {
            throw new Error("please enter password and confirm to proceed")
        }
        if (password != confirmPassword) {
            throw new Error("both passsword doesn't not match please check and try again")
        }
        const newPassword = await user.findOneAndUpdate({ email: email }, { password },
            { new: true, runValidators: true });
        res.status(200).json({
            status: `successful`,
            message: `password successfully changed`
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = { register, login, forgotPassword, verifyNewUser, resetPassword, verifyOtpForForgotPassword };
