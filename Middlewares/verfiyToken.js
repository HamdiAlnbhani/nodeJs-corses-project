 const jwt=require("jsonwebtoken");
 const httpStatusText=require("../Utils/httpStatusText.js")
 const AppError=require("../Utils/appError.js")
const verfiyToken=(req,res,next)=>{
    const authHeader =req.headers["authorization"] || req.headers["Authorization"];
    if(!authHeader){
        const error=AppError.create("token is required",401,httpStatusText.UNAUTHORIZED)
          return next(error);
    }
    const token = authHeader.split(' ')[1];
   
try{
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
   req.currentUser=decodedToken 
      next();
}catch(err){
   const error = AppError.create("invalid token", 401, httpStatusText.UNAUTHORIZED);
   return next(error);
}
 
}
module.exports=verfiyToken