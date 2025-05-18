const express =require("express");
const { PurchaseModel, CourseModel } = require("../db/mongodb");
const courseRouter = express.Router();
const {userMiddleware} = require("../middlewares/userauth")

courseRouter.post("/purchase",userMiddleware,async (req,res)=>{
const userId = req.userId;
const {courseId} = req.body;

const purchased = await PurchaseModel.findOne({
  userId,
  courseId
});

if(purchased){
    res.status(303).json({
        message:"you have already pruchases the course"
    })
    return;
}

const course = await CourseModel.findById(courseId);
if (!course) {
    return res.status(403).json({ message: "Course is not available" });
}

await PurchaseModel.create(
{
    userId:userId,
    courseId:courseId
}
)
res.status(203).json({
    message:"you have successfully purchased the course "
})
})

courseRouter.get("/view",async (req,res)=>{
   const courses = await CourseModel.find({
   });

   res.json({
    courses
   })
})
 
module.exports = {
    courseRouter
}
