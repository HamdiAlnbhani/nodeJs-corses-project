const express=require("express")
const router=express.Router();
const allowed=require("../Middlewares/allowed.js")
const verfiyToken=require("../Middlewares/verfiyToken.js")
const courseController = require("../Controllers/courses.controller.js");
const { validationSchema } = require("../Middlewares/validationSchema.js");
const userRoles = require("../Utils/userRoles.js");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verfiyToken,allowed(userRoles.ADMIN, userRoles.MANGER),validationSchema(), courseController.addNewCourse);

router.route("/:courseId")
  .get(courseController.getCourse)
  .patch( verfiyToken,allowed(userRoles.ADMIN,userRoles.MANGER),courseController.editCourses)
  .delete(verfiyToken,allowed(userRoles.ADMIN,userRoles.MANGER),courseController.deleteCourse)

module.exports=router