const express=  require("express");
const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
email:{type:String,unique:true,required:true},
password:{type:String,required:true},
firstName : String,
lastName:String
})

const Admin = new Schema({
email:{type:String,unique:true,required:true},
password:{type:String,required:true},
firstName : String,
lastName:String,
})

const Course = new Schema({
    title:String,
    descrition:String,
    price :{type:Number,required:true},
    imageURL:String, 
IsPublished:Boolean,
creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminModel'
  }
})

const Purchase = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseModel'
  }
});


const UserModel = mongoose.model("UserModel",User)
const AdminModel = mongoose.model("AdminModel",Admin)
const CourseModel = mongoose.model("CourseModel",Course); 
const PurchaseModel =mongoose.model("PurchaseModel",Purchase);

module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}
