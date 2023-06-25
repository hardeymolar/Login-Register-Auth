const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: String,
    password: String,
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("user", userSchema);
