
const _=require('lodash');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const moment = require("moment");
const nodemailer = require("nodemailer");
const router = express.Router();
const { UserModel} = require("../models/userModel");
const {roleModel}=require("../models/rolesModel");
const {subscriptionModel} = require("../models/subscriptionModel");
const { teacherModel} = require("../models/teacherModel");
const { stdEnrollementModel } = require("../models/StdudentEnrollmentModel");
const {classModel} = require("../models/classModel");
const { studentModel, studentsValidation } = require("../models/studentModel");
const { feeModel } = require("../models/feeModel");
var os = require("os");
const ip = require("ip");


router.post("/", async (req, res) => {
  try {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({status:false,message:error.details[0].message});
  // get user Email from database
  const studentInfo = await studentModel.findOne({ stdID: req.body.stdID });
  if (!studentInfo) return res.json({status:false,message:"invalid Username or password"});
  const userinfo = await UserModel.findOne({studentID: studentInfo._id });
  // check email if exists in database
  if (!userinfo) return res.json({status:false,message:"invalid Username or password"});
  // compare 2 plain password and hash password
  const validatePassword = await bcrypt.compare(
    req.body.password,
    userinfo.password
  );
  if (!validatePassword)return res.json({status:false,message:"invalid username or Password"});
  
  if (!userinfo.status)
  return res.json({
    status: false,
    message: "This user access denied contact Your admin",
  });
  
  const userRole = await roleModel.findOne({ role: userinfo.userType});
      let permission = [];
      if(userRole){
        permission = userRole.permissions;
      }
    

  let subscriptionData=await subscriptionModel.findOne().sort({ createdAt: -1 }).limit(1)
    
  if(!subscriptionData) return res.json({ status:false,message:"make Subscription before login!"})
   let date1 = moment(subscriptionData.expiredDate)
   let date2 = moment() // current date

   let reminedDays = date2.diff(date1, "days")
   let reminedHours=date1.diff(date2, 'hours')
   let reminedminutes=date1.diff(date2, 'minutes')
   let reminedseconds=date1.diff(date2, 'seconds')
   
   if(reminedseconds<=0) return res.json({ status:false, message:
    "Dear User,please Don't Worry There are No Issues with The Software, only The Subscription Term Has Been Expired."})

    // let TokenDateExpired = moment().add(1, "days");

    let current=moment();
    let TodayendDate= moment().endOf('day')
    let DayReminedHours=TodayendDate.diff(current, 'hours')

    let TokenDateExpired = moment().add(DayReminedHours, "hours");

    if(userinfo.userType=="student"){
      let {studentID}=userinfo
      let stdID=studentID.toString()
      const studentinfo = await studentModel.findOne({ _id: stdID });
      const studentsFee = await feeModel.find({studentID,feeBalance: { $gt: 0}})
      let stdfeelenth=studentsFee.length
      
      const EnrollemntData = await stdEnrollementModel.find()
      const classData = await classModel.find()
        
      let studentEnrollment = EnrollemntData.filter(
        enroll => enroll.studentID == stdID
      )   
      
      let filteredclass = []
      classData.filter(function (newData) {
        return studentEnrollment.filter(function (oldData) {
          if (newData._id.toString() == oldData.classID.toString()) {
            filteredclass.push(newData)
          }
        })
      })
console.log("stdfeelenth",stdfeelenth)
      if(stdfeelenth>0){
        filteredclass=[]
      }
      // return res.send(filteredclass)
      const token=  jwt.sign({_id:userinfo._id,name:userinfo.name,userType:userinfo.userType,
        menus:permission,SubscriptionExpiredDate:subscriptionData.expiredDate,tokenExpiredDate:TokenDateExpired,
       studentClasses:filteredclass,studentID:stdID,studentInfo:studentinfo},'jwtPriviteKey');
     res.header("auth-token",token).json({status:true,message:"successfully loggged",token:token});
     
    }else{

      const token=  jwt.sign({_id:userinfo._id,name:userinfo.name,userType:userinfo.userType,
        menus:permission,SubscriptionExpiredDate:subscriptionData.expiredDate,tokenExpiredDate:TokenDateExpired,
        teacherID:userinfo.teacherID},'jwtPriviteKey');
     res.header("auth-token",token).json({status:true,message:"successfully loggged",token:token});

    }
    

   

 
} catch (error) {
  res.send({status:false, message:error.message})
}

});

function validate(req) {
  const userValidation = Joi.object({
    stdID: Joi.string().required(),
    password: Joi.string().required(),
  });
  return userValidation.validate(req);
}

module.exports = router;
