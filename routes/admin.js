const express = require("express");
const adminRouter = express.Router();
const {z}  = require("zod");
const bcrypt = require("bcrypt");
const {AdminModel} = require("../db/mongodb");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET_KEY} = require("../config")
const {adminMiddleWare} = require("../middlewares/adminauth");
const { CourseModel } = require("../db/mongodb");
const array = require("array/lib/array");


adminRouter.get("/",(req,res)=>{
    res.render("adminauth",{

    })
})

adminRouter.get("/panel",(req,res)=>{
    res.render("adminpanel");
})

adminRouter.post("/signup",async (req,res)=>{

const requiredBody = z.object({
email:z.string().email().min(14).max(50),
password:z.string().min(8).max(50),
firstName :z.string().min().max(15),
lastName:z.string().min(3).max(15)
});

const {email,password,firstName,lastName} = req.body;
const emailFound  = await AdminModel.findOne({email:email});
if(emailFound){
    return res.status(403).json({message:"email already exists please sign in"});
}

const parsedDataWithSuccess = requiredBody.safeParse(req.body);
console.log(req.body);
console.log(parsedDataWithSuccess.error);
if(!parsedDataWithSuccess.success){
    res.status(403).json({message:"incorrecr format",
        error:`${parsedDataWithSuccess.error}`});
    return;
}

const hashedPassword= await bcrypt.hash(password,5);
await AdminModel.create({
    email:email,
    password:hashedPassword,
    firstName:firstName,
    lastName:lastName
})

res.status(203).json({message:"admin signed up"});

})


adminRouter.post("/signin",async (req,res)=>{
   const requiredBody = z.object({
        email:z.string().email().min(14).max(50),
        password:z.string().max(50)
    });
    
    const {email,password} = req.body;

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.status(403).json({message:"incorrecr format"});
    return;
}

const adminFound   = await AdminModel.findOne({
    email:email,
})

if(!adminFound){
res.status(403).json({message:"admin not found please sign up first"})
return;
}

const comparedPassword = await bcrypt.compare(password,adminFound.password);

if(!comparedPassword){
    res.status(404).json({message:"password did not matched"});
    return;
}
const token = jwt.sign({
    id:adminFound._id,
},JWT_ADMIN_SECRET_KEY);
res.status(203).json({message:"admin signed up",token:token});
})


console.log("before middleware")
adminRouter.post("/course",adminMiddleWare,async (req,res)=>{
const adminId = req.adminId;

const {title,description,imageURL,price,IsPublished} = req.body;

const course = await CourseModel.create({
    title:title,
    description:description,
    imageURL:imageURL,
    price:price,
    IsPublished:IsPublished,
    creatorId:adminId
});

res.status(203).json({message:"course created",
    courseId:course._id
});

})



adminRouter.put("/course/edit",adminMiddleWare,async (req,res)=>{
    const adminId = req.adminId;
    const {title,description,imageURL,price,IsPublished,courseId} = req.body;

    const courseFound = CourseModel.findOne({
        _id:courseId,
        creatorId:adminId
    })
    if(!courseFound){
        res.status(404).json({
            message:"course not found with this reference id try again please with a valid id"
        });
        return ;
    }

const course = await CourseModel.updateOne({
    _id:courseId,
    creatorId:adminId
}
    ,{
    title:title,
    description:description,
    imageURL:imageURL,
    price:price,
    IsPublished:IsPublished
});

res.status(203).json({message:"course updated",
    courseId:course._id
});

})

adminRouter.get("/course/view", adminMiddleWare, async (req, res) => {

  const adminId = req.adminId;
  const courseFound = await CourseModel.find({ creatorId: adminId });

  if (!courseFound) {
    return res.status(403).json({ message: "courses not found upload first" });
  }

 res.status(203).json({
    message: "courses fetched successfully",
    courses: courseFound
  });
});

module.exports = {
    adminRouter
}
