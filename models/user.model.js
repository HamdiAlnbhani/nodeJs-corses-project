const mongoose=require("mongoose");
const  validator =require( "validator");
const userRoles=require("../Utils/userRoles")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate:[validator.isEmail,"filed must be email address"]
  },
  password: {
    type: String,
    required: true,
  },
  token:{
    type:String
  },
  role:{
    type:String,
    enum:[userRoles.ADMIN,userRoles.USER,userRoles.MANGER],
    default:userRoles.USER
  },
  avatar:{
   type:String,
   default:"uploads/imag.png", 
  }
});
module.exports=mongoose.model('user',userSchema)