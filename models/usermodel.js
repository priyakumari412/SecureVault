let mongoose = require('mongoose')


let userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    masterpassword: {
        type: String,
        required: true
    },
    subscription:{
        type:Boolean,
        default:false
    },
    profile:{
        type:String,
        default:'https://digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png'
    }
})

let usermodel = mongoose.model('user', userschema)
module.exports = { usermodel }