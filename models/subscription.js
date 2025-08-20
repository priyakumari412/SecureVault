
let mongoose = require('mongoose')

let Schema= mongoose.Schema({

     customerid:{
        type:String,
        required:true,
     },
     subscriptionid:{
        type:String,
        required:true,
     },
     priceid:{
        type:String,
        required:true,
     },
     status:{
        type:String,
        required:true,
     },
     currentperiodstart:{
        type:String,
        required:true,
     },
     currentperiodend:{
        type:String,
        required:true,
     },
     trialstart:{
        type:String,
        required:true,
     },
     trialend:{
        type:String,
        required:true,
     },
     cancelAtperiodend:{
        type:Boolean,
        required:true,
     },
     cancelAt:{
        type:String,
        required:true,
     },

})

let subscriptionModel = mongoose.model('Subscription', Schema)

module.exports={subscriptionModel}

