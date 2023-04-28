const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const fs =require("fs");
const router = express.Router();
// const crypto=require("crypto")
// const multer = require("multer");
// const sharp=require("sharp")
// const {GridFsStorage} = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const { required } = require("joi");
// const { size } = require("lodash");
const { UserModel, validateUsers } = require("../models/userModel");
// Create storage engine
// const mongoURI = 'mongodb://localhost/startupDB';
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

router.get("/", async function (req, res) {
  try {
    // res.send("welcome");
    const userInfo = await UserModel.find();
    res.send(userInfo)

  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {

  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send({status:false,message:error.details[0].message});
  const checkUsername = await UserModel.findOne({ username: req.body.username });
  if (checkUsername) return res.json({
    message: "This username alreday exists..",
    status: false,
  })
  

  // upload.single("userImage")

  // console.log("req.file",req.file);
  // let resisedImage=await sharp(req.file.buffer).grayscale().resize(512,512).toFile('test.jpg');

// let imagecompressed=await sharp(req.file.buffer).resize(300, 250).toBuffer()
// const metadata = await imagecompressed.metadata()
// console.log(metadata.width, metadata.height)
// best size
// resize(800, 600)
// const image = { data: new Buffer.from(imagecompressed, 'base64'), contentType: req.file.mimetype }
//   console.log(" length",req.file.buffer.length);
//   console.log("imagecompressed length",imagecompressed.length);
//   console.log("imagecompressed length",imagecompressed.length);
//   console.log("image",image.data.length);
// return res.send(req.body)
  // var per = req.body.permissions;
  // var permessionArr = per.split(','); 
  // split string on comma space
  
  // const image = { data: new Buffer.from(req.file.buffer, 'base64'), contentType: req.file.mimetype }
  // const image = { data: new Buffer.from(imagecompressed, 'base64'), contentType: req.file.mimetype }
    const userinfo = new UserModel({
      name: req.body.name,
      phone:req.body.phone,
      username: req.body.username,
      password: req.body.password,
      userType: req.body.userType,
      // userImage:image,
      // permissions: permessionArr,
    });
    // return res.send(userinfo)
    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(userinfo.password, salt);
    await userinfo.save();
    res.json({
      message: "User Registered Successfully",
      status: true,
      info:userinfo
    });
  } catch (err) {
   console.log(err)
    res.status(500).send({status: false, message: err.message})
  }
});
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await UserModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const usersData = {
      name: req.body.name,
      username: req.body.username,   
      password: req.body.password,
    };
    const salt = await bcrypt.genSalt(10);
    usersData.password = await bcrypt.hash(usersData.password, salt);
   const upData = await  UserModel.findByIdAndUpdate(req.params.id,
    usersData,{new:true});
    res.json({
      message: "successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});
// router.put("/blockuser/:id", async (req, res) => {
//   try {
   
//     const { id } = req.params;
//   const userData = await UserModel.findById(id.trim());
//   if (!userData) return res.status(404).send("given id was not found");

//   const UpdatedInfo = await UserModel.findByIdAndUpdate(
//     id,
//     {
//       blockStatus:req.body.blockStatus,
//     },
//     { new: true }
//   );
//  if(req.body.blockStatus===false){
//   res.json({status:true,message:"This User Was Removed Block",info:UpdatedInfo});
//  }else if(req.body.blockStatus===true){
//   res.json({status:true,message:"This User Was Blocked",info:UpdatedInfo});
//  }
//   } catch (error) {
//     res.send(error.message)
//   }
// });

router.put("/blockuser/:id", async (req, res) => {
  // return res.send(req.body)
  try {
    const { id } = req.params;
    const userData = await UserModel.findById(id.trim());
    if (!userData) return res.status(404).send("given id was not found");

    const UpdatedInfo = await UserModel.findByIdAndUpdate(
      id,
      {
        status: req.body.currentstatus,
      },
      { new: true }
    );
    if (req.body.currentstatus == true) {
      res.json({
        status: true,
        message: "This User Was Removed Block",
        info: UpdatedInfo,
      });
    } else {
      res.json({
        status: true,
        message: "This User Was Blocked",
        info: UpdatedInfo,
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await UserModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
   
   const upData = await  UserModel.findByIdAndUpdate(req.params.id,
   {DeleteStatus: req.body.DeleteStatus},{new:true});
    res.json({
      message: "successfully deleted",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});



// function saveCover(userinfo, coverEncoded) {
//   if (coverEncoded == null) return
//   const cover = JSON.parse(coverEncoded)
//   if (cover != null && imageMimeTypes.includes(cover.type)) {
//     userinfo.userImage = new Buffer.from(cover.data, 'base64')
//     // userinfo.coverImageType = cover.type
//   }
// }
module.exports = router;
