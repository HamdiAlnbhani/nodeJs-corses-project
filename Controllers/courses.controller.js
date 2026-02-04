const {validationResult}=require("express-validator")
const Courses=require("../models/course.model.js");
const AppError=require("../Utils/appError.js");
const httpStatusText = require("../Utils/httpStatusText.js");
const asyncWrapper = require("../Middlewares/asyncWrapper.js");

const getAllCourses=asyncWrapper(async (req,res)=>{

  let query=req.query;
  let limit=query.limit ||10;
  let page=query.page ||1;
  let skip=(page-1)*limit;
  
  const courses=await Courses.find({},{"__v":false}).limit(limit).skip(skip);
  return  res.json({status:httpStatusText.SUCCESS,data:{courses}});
})

const getCourse = asyncWrapper(async (req, res,next,) => 
{

    const courseId = req.params.courseId;
    const course = await Courses.findById(courseId, { "__v": false });
    if (!course) {
      const error=AppError.create("course not found",404,httpStatusText.FAIL)
      return next(error);
    }
    return res.json({ status: httpStatusText.SUCCESS, data: { course } });
    
});


const addNewCourse= asyncWrapper(async (req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
      return next(error);
    }
    const course=await Courses.create(req.body)
     const error = AppError.create({ course }, 200, httpStatusText.SUCCESS);
     return next(error);
  })

  const editCourses =asyncWrapper(async(req, res,next) => {
     const courseId = req.params.courseId;
    let course=await Courses.findByIdAndUpdate(courseId,req.body,{new:true})
    if (!course) {
      const error = AppError.create("course not found", 404, httpStatusText.FAIL);
      return next(error);
    }
     const error = AppError.create({ course: course }, 200, httpStatusText.SUCCESS);
     return next(error);
  })

 const deleteCourse=asyncWrapper(async (req,res,next)=>{ 

const courseId=req.params.courseId;
const course=await Courses.findByIdAndDelete(courseId)

if(!course){
   const error = AppError.create("course not found", 404, httpStatusText.FAIL);
     return next(error);
}
 const error = AppError.create("course deleted successfully", 200, httpStatusText.SUCCESS);
 return next(error);
})

module.exports={
    getAllCourses,
    getCourse,
    addNewCourse,
    editCourses,
    deleteCourse
}