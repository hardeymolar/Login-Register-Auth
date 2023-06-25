const {
    register, login, verifyNewUser,forgotPassword, resetPassword,
    verifyOtpForForgotPassword } = require('../controllers/auth')
const {resendOtpVerificationCode} = require('../utils/email')
const { auth } = require('../middleware/authentication')

const express = require('express')
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/verifyOTP', verifyNewUser);
router.post('/resendOtp', resendOtpVerificationCode);


router.post('/forgotPassword', forgotPassword);
router.post('/verifyOtpForgotPassword', verifyOtpForForgotPassword);
router.patch('/resetPassword', auth, resetPassword);


module.exports = router