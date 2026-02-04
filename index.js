require("dotenv").config();
const express = require("express");
const app = express();
const cors =require("cors")
const path=require("path")
app.use(cors())
app.use(express.json());
const httpStatusText = require("./Utils/httpStatusText.js");

const mongoose = require("mongoose");

const courses = mongoose.connect(process.env.MONGO_URL).then(()=>{
console.log("database connected");
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const userRouter = require("./Routes/user.router");
app.use("/api/users/", userRouter);
const courseRouter = require("./Routes/Courses-routes");
app.use("/api/courses/", courseRouter);

app.use((req,res)=>{
 return  res.status(404).json({status:httpStatusText.ERROR,message:"this resource not found"});
})
app.use((error,req, res,next) => {
  return res.status(error.statusCode || 500).json({ status:error.statusText || httpStatusText.ERROR, message: error.message, statusCode: error.statusCode||500,data:null});
});

app.listen(process.env.PORT||3002, "localhost", () => {
  console.log("listening on port 3002");
});
