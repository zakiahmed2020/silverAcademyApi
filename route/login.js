
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
var os = require("os");
const ip = require("ip");
let userPermessions=[
  {
    name: "Dashboard",
    icon: "ti-home",
    path: "/dashboard"
  },
  {
    name: "CRM",
    icon: "ti-bookmark-alt",
    path: "",
    subMenu: [
        {
          name: "Customers",
          path: "/customers"
        },
        
      ]
  },
  {
    name: "HRM",
    icon: "ti-package",
    path: "",
    subMenu: [
        {
          name: "Employee",
          path: "/employee"
        },
        
      ]
  },

  {
    name: "Users",
    icon: "fas fa-user",
    path: "",
    subMenu: [
        {
          name: "Users",
          path: "/users"
        },
        {
          name: "Roles",
          path: "/roles"
        },
        {
          name: "Activity",
          path: "/activity"
        }
      ]
  },

 
  {
    name: "Reports",
    icon: "ti-view-grid",
    path: "",
    subMenu: [
      {
        name: "Customer Report",
        path: "/customerReport"
      },
      {
        name: "Users Report",
        path: "/usersReport"
      },
     
    ]
  }

]

router.post("/", async (req, res) => {
  try {
    
  
  // console.log("ip",ip.address());
  var hostaddress = os.hostname();
  // console.log("hostname",hostaddress);
 
  const { error } = validate(req.body);
  if (error) return res.status(400).send({status:false,message:error.details[0].message});
  // get user Email from database
  const userinfo = await UserModel.findOne({ username: req.body.username });
  // check email if exists in database
  if (!userinfo) return res.json({status:false,message:"invalid Username or password"});
  // compare 2 plain password and hash password
  const validatePassword = await bcrypt.compare(
    req.body.password,
    userinfo.password
  );
  if (!validatePassword)return res.json({status:false,message:"invalid username or Password"});
  // if(userinfo.DeleteStatus)  return res.json({status:false,message:"This user has been deleted"});
  // if(userinfo.blockStatus===true)  return res.json({status:false,message:"access denied plz contact your admin thank !"});

  // const token= await userinfo.generateAuthToken();
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
      // console.log(permission)
  // if (userinfo.permissions) {
  //   userinfo.permissions.forEach((path) => {
  //     let route = userPermessions.find((item) => item.path === path);
  //     if (!route) {
  //       userPermessions.find((item) => {
  //         let current_submenu = item.subMenu?.find((submenu) => submenu.path === path)
  //         if (current_submenu) {
  //           if (userroles.find((usr) => usr.name == item.name)) {
  //             userroles.map(role=>{
  //               if (role.name == item.name) {
  //                 role.subMenu.push(current_submenu)
  //               }
  //             })
  //           } else {
  //             let current_route = { ...item };
  //             current_route.subMenu = current_route.subMenu.filter(
  //               (item) => item.path === path
  //             );

  //             userroles.push(current_route);
  //           }
  //         }
  //       });
  //     } else {
  //       userroles.push(route);
  //     }
  //   });
  // }

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
router.post("/activation", async (req, res) => {
  try {
   
    const code=Math.floor(Math.random() * 1000000);
  
    const { error } = validateEmail(req.body);
    if (error)return res.status(404).json({ status: false, message: error.details[0].message });
    
    const checkEmail = await UserModel.findOne({ username: req.body.email });
    if (!checkEmail)
    return res.json({ status: false, message: "This Email is not Registered" });

    let mainTransport = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "huudtechnology1@gmail.com",
        pass: "chtixzlwjuwsvlbs",
      },
    });
    let details = {
      from: "huudtechnology1@gmail.com", // sender address
      to: req.body.email, // sender
      subject: "Huud Technology", // Subject line
      html:`<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

      <head>
        <title>
        </title>
       
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
      
          .ReadMsgBody {
            width: 100%;
          }
      
          .ExternalClass {
            width: 100%;
          }
      
          .ExternalClass * {
            line-height: 100%;
          }
      
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
      
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
      
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
      
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        
        <style type="text/css">
          @media only screen and (max-width:480px) {
            @-ms-viewport {
              width: 320px;
            }
      
            @viewport {
              width: 320px;
            }
          }
        </style>
        
        
        <link href="https://fonts.googleapis.com/css?family=Open Sans" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Open Sans);
        </style>
        
        <style type="text/css">
          @media only screen and (min-width:480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          }
        </style>
        <style type="text/css">
          [owa] .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        </style>
        <style type="text/css">
          @media only screen and (max-width:480px) {
            table.full-width-mobile {
              width: 100% !important;
            }
      
            td.full-width-mobile {
              width: auto !important;
            }
          }
        </style>
      </head>
      
      <body style="background-color:#f8f8f8;">
        <div style="background-color:#f8f8f8;">
        
          <div style="Margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-bottom:0px;padding-top:0px;text-align:center;vertical-align:top;">
                  
                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                          <td align="left" style="font-size:0px;padding:0px 0px 0px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                            <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:left;color:#797e82;">
                              <p style="text-align: center; margin: 10px 0;">Huud technology &nbsp;| <a target="_blank" rel="noopener noreferrer" href="#"></a><span style="color:#797e82; text-decoration: underline"> View online version</span></p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
         
          <div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;vertical-align:top;">
                 
                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                          <td style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:0px;padding-bottom:40px;padding-left:0px;word-break:break-word;">
                            <p style="border-top:solid 7px #0099EE;font-size:1;margin:0px auto;width:100%;">
                            </p>
                        
        
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:110px;">
                                    <img alt="" height="auto" src="https://logo.clearbit.com/huudtechnology.com" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;" title="" width="110" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                 
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      
         
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
          <div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-bottom:70px;padding-top:30px;text-align:center;vertical-align:top;">
                   
                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                          <td align="left" style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-right:50px;padding-bottom:0px;padding-left:50px;word-break:break-word;">
                            <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#797e82;">
                              <h1 style="text-align:center; color: #000000; line-height:32px">Forgot your password?</h1>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-right:50px;padding-bottom:0px;padding-left:50px;word-break:break-word;">
                            <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#797e82;">
                              <p style="margin: 10px 0; text-align: center;">To complete the password change, please use this code.</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:10px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                              <tr>
                                <td  role="presentation" >
                                  <a href="#" style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;" target="_blank">
                                    <h2 style="font-weight:700">${code}</h2>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
       
          <div style="Margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-bottom:0px;padding-top:20px;text-align:center;vertical-align:top;">
                    
                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                        
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                              <tr>
                                <td style="padding:4px;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0099EE;border-radius:6px;width:30;">
                                    <tr>
                                      <td style="font-size:0;height:30;vertical-align:middle;width:30;">
                                        <a href="https://Facebook.com/huudtechnology" target="_blank">
                                          <img height="30" src="http://saas-templates-creator.mailjet.com/saas-templates-creator/static/img/facebook_white.png" style="border-radius:6px;" width="30" />
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                           
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                              <tr>
                                <td style="padding:4px;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0099EE;border-radius:6px;width:30;">
                                    <tr>
                                      <td style="font-size:0;height:30;vertical-align:middle;width:30;">
                                        <a href="https://Twitter.com/huudtechnology" target="_blank">
                                          <img height="30" src="http://saas-templates-creator.mailjet.com/saas-templates-creator/static/img/twitter_white.png" style="border-radius:6px;" width="30" />
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                              <tr>
                                <td style="padding:4px;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0099EE;border-radius:6px;width:30;">
                                    <tr>
                                      <td style="font-size:0;height:30;vertical-align:middle;width:30;">
                                        <a href="https://Linkedin.com/company/huudtechnology" target="_blank">
                                        
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                         
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:0px 20px 0px 20px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                            <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#797e82;">
                              <p style="margin: 10px 0;"><a target="_blank" rel="noopener noreferrer" style="color:#0099EE" href="#"><span style="color:#0099EE">Page 1</span></a><span style="color:#797e82">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:#0099EE" href="#"><span style="color:#0099EE">Page 2</span></a><span style="color:#797e82">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:#0099EE" href="#"><span style="color:#0099EE">Page 3</span></a></p>
                              <p style="margin: 10px 0;">C<a target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none" href="[[UNSUB_LINK_EN]]">lick <span style="color:#0099EE"><u>here</u></span> to unsubscribe</a>.<br /><span style="font-size:10px">Created by&nbsp;</span><a target="_blank" rel="noopener noreferrer" style="font-size:10px; color:inherit; text-decoration: none" href="https://www.mailjet.com/?utm_source=saas_email_templates&amp;utm_medium=logo_footer_email&amp;utm_campaign=password_reset"><span style="color:#0099EE"><u>Mailjet</u></span></a></p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </body>
      
      </html>`
    };
    await mainTransport.sendMail(details);
    res.json({
      status: true,
      message:
        "acivation code was sent",
      activationCode: code,
    });
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/passUpdate", async function (req, res) {
  const {email,password}=req.body
  const userInfo = await UserModel.findOne({username:email});
  if (!userInfo) return res.json({status:false,message:"email is incorrect, please try again !"});
  // res.send(userInfo)
 
  const {_id}=userInfo
  const salt = await bcrypt.genSalt(10);
  const pcript_password = await bcrypt.hash(password, salt);
  // res.send(pcript_password)
  
  const passwordUpdate = await UserModel.findByIdAndUpdate(_id,
    { 
      password: pcript_password,
    },
    { new: true }
  );
  res.json({status:true,message:"Your Password Updated SuccessFully"});
});
function validateEmail(req) {
  const userValidation = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    
  });
  return userValidation.validate(req);
}
function validate(req) {
  const userValidation = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
  });
  return userValidation.validate(req);
}

module.exports = router;
