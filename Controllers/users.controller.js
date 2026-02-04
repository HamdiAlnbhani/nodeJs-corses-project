
const User=require("../models/user.model.js");
const httpStatusText = require("../Utils/httpStatusText.js");
const asyncWrapper = require("../Middlewares/asyncWrapper.js");
const AppError = require("../Utils/appError.js");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const generateJWT = require("./generateJWT.js");
require ("dotenv").config();
const getAllUsers=asyncWrapper(async (req,res)=>{

  let query=req.query;
  let limit=query.limit ||10;
  let page=query.page ||1;
  let skip=(page-1)*limit;
  
  const users=await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
   return res.json({status:httpStatusText.SUCCESS,data:{users}});
})


const register=asyncWrapper(async(req,res,next)=>{
  const avatar=req.file.filename
  const { firstName, lastName, email, password, role} = req.body;
  const oldUser=await User.findOne({email:email})
  if(oldUser){
    const error=AppError.create("user already exists",400,httpStatusText.FAIL)
          return next(error);
  }
  const hashedPassword=await bcrypt.hash(password,10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar
  });
  // generate JWT token
 const token=await generateJWT({email:user.email,id:user._id,role:user.role})
 user.token=token;
 
 return res.status(201).json({status:httpStatusText.SUCCESS,data:{user}});
})

const login=asyncWrapper(async(req,res,next)=>{
  const{password,email}=req.body;
  if(!email &&!password){
    const error =AppError.create("email and passord requierd",400,httpStatusText.FAIL)
    return next(error);
  }
 const user=await User.findOne({email:email})

if(!user) {
  const error =AppError.create("user not found",400,httpStatusText.FAIL)
  return next(error);
}
const matchPassword=await bcrypt.compare(password,user.password)

if(user && matchPassword){
  const token=await generateJWT({email:user.email,id:user._id,role:user.role})
  return res.status(201).json({ status: httpStatusText.SUCCESS, data: {token} });
}else{
  const error =AppError.create("something went wrong",500,httpStatusText.ERROR)
  return next(error);
}

})

module.exports = {
  getAllUsers,
  register,
  login,
};