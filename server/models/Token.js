 const mongoose = require('mongoose');
 const tokenschema = new mongoose.Schema({
    tokenNo:Number,
    name:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"Waiting"
    },
    createdAt: {
  type: Date,
  default: Date.now
},
    counter:String,


    
 });
 const Token = mongoose.model("Token",tokenschema);
 module.exports = Token