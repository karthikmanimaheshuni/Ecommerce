import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true, unique:true},
    password : {type:String,required:true},
    cartData : {type:Object,default:{}}

},{minimize:false})

//minimize property when ever we create user we provide a empty object , so in mongoose then the user will be created with cart data unavialable  

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;