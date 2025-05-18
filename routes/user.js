const express = require("express");
const userRouter = express.Router();
const {z} = require("zod");
const bcrypt  = require("bcrypt");
const {UserModel}  = require("../db/mongodb");
const {PurchaseModel,CourseModel}  = require("../db/mongodb");
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET_KEY}  = require("../config");
const {userMiddleware} = require("../middlewares/userauth")

userRouter.get("/",(req,res)=>{
    res.render("userauth")
})
userRouter.get("/panel",(req,res)=>{
res.render("userpanel");
})
userRouter.get("/purchased",(req,res)=>{
    res.render("userPurchased");
})

userRouter.post("/signup",async (req,res)=>{

const requiredBody = z.object({
email:z.string().email().min(14).max(50),
passowrd:z.string().max(50),
firstName : z.string().min(4).max(15),
lastName:z.string().min(3).max(15),
});

const {email,password,firstName,lastName} = req.body;
const emailFound  = await UserModel.findOne({email:email});
if(emailFound){
    return res.status(403).json({message:"email already exists please sign in"});
}

const parsedDataWithSuccess = requiredBody.safeParse(req.body);
if(!parsedDataWithSuccess){
    res.status(403).json({message:"incorrecr format"});
    return;
}

const hashedPassword= await bcrypt.hash(password,5);

try{
    await UserModel.create({
        email:email,
        password:hashedPassword,
        firstName:firstName,
        lastName:lastName,
    });
    res.status(203).json({message:"user signed up"});
}
catch(e){
    res.json({message:'error = ${e}'});
    console.log(e);
}

})


userRouter.post("/signin",async (req,res)=>{
    
    const requiredBody = z.object({
        email:z.string().email().min(14).max(50),
        password:z.string().max(50)
    });
    
    const {email,password} = req.body;

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.status(403).json({message:"incorrect format"});
    return;
}

const userFound   = await UserModel.findOne({
    email:email,
})

if(!userFound){
res.status(403).json({message:"user not found please sign up first"})
return;
}

const comparedPassword = await bcrypt.compare(password,userFound.password);
if(!comparedPassword){
    res.status(404).json({message:"password did not matched"});
    return;
}
const token = jwt.sign({
    id:userFound._id,
},JWT_USER_SECRET_KEY);

res.status(203).json({message:"user signed up",token:token});
})





userRouter.get("/course/valid", async (req, res) => {
  const courseFound = await CourseModel.find({ IsPublished:true});
  if (!courseFound) {
    return res.status(403).json({ message: "no courses are not found  currently" });
  }

  const courseArray  = Array.from(courseFound);
 res.status(203).json({
    message: "courses fetched successfully",
    courses: courseArray
  });
});


userRouter.get("/purchasedCourse",userMiddleware,async (req,res)=>{
const userId = req.userId;
const purchasedCourses= await PurchaseModel.find({
userId:userId
});
if(!purchasedCourses){
    res.status(403).json({
        message:"you did not have any purchased course"
    })
    return;
}

const courseData  = await CourseModel.find({
    _id:{$in:purchasedCourses.map(x=>x.courseId)}
})
const courseArray = Array.from(purchasedCourses);

res.status(203).json({
    courseArray,
    courseData
})
})


module.exports = {
    userRouter
}
