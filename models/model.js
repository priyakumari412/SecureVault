let mongoose = require('mongoose')

let schema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },

    title:{
        type:String,
        required:true
    },
    website:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    passiv:{
        type:String,
        required:true
    },
    useriv:{
          type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    }
 
})

let Model = mongoose.model('Password', schema)
module.exports = {Model}