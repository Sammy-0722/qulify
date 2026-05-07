const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]

    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password must be atleast 8 character long"],
    },
    isOpen: {
        type: Boolean,
        default: true
    }
    
})
 const Admin = mongoose.model("Admin",adminSchema)
 module.exports = Admin