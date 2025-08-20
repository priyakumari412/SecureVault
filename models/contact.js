let mongoose = require('mongoose')

let Schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

let contactModel = mongoose.model('Contact', Schema)
module.exports = {contactModel}