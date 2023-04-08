const express = require("express");
const router = express.Router();

const {classModel,validateClass} = require("../models/classModel");

router.get("/", async function (req, res) {
  try {
    const classDate = await classModel.find().populate({
      path:"courseID",
      model:"courses",
      select:"courseName coursePrice"
    }).
    populate({
      path:"teacherID",
      model:"teachers",
      select:"teacherName teacherPhone"
    }).
    sort({createdAt: -1});
    res.send(classDate)
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/:id", async function (req, res) {
  try {
    const classDate = await classModel.findOne({_id:req.params.id}).populate().sort({createdAt: -1});
    res.send(classDate)
  } catch (error) {
    res.send(error.message)
  }
})

router.post("/", async function (req, res) {
 try {
  const { error } = validateClass(req.body);
  if (error) return res.json({status:false,message:error.details[0].message});
  
  const className = await classModel.findOne({ className: req.body.className });
  if (className) return res.json({status: false, message: "This class alreday exists..", })

  const classDate = new classModel({
    className: req.body.className,
    courseID: req.body.courseID,
    teacherID: req.body.teacherID,
    days: req.body.days,
    classShift: req.body.classShift,
    startedDate: req.body.startedDate,
    endDate: req.body.endDate,
    TimeIn: req.body.TimeIn,
    TimeOut: req.body.TimeOut,
    classStatus: req.body.classStatus,
  });
 

  await classDate.save();
  res.json({
    message: "successfully created.",
    status: true,
    info: classDate,
  });
  
 } catch (error) {
  res.json({status:false,message:error.message});
 }
});
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await classModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const classDate = {
      className: req.body.className,
      courseID: req.body.courseID,
      teacherID: req.body.teacherID,
      days: req.body.days,
      classShift: req.body.classShift,
      startedDate: req.body.startedDate,
      endDate: req.body.endDate,
      TimeIn: req.body.TimeIn,
      TimeOut: req.body.TimeOut,
      classStatus: req.body.classStatus,
    };
   const upData = await  classModel.findByIdAndUpdate(req.params.id,
    classDate,{new:true});
    res.json({
      message: " successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await classModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
   
   const upData = await  classModel.findByIdAndUpdate(req.params.id,
   {DeleteStatus: req.body.DeleteStatus},{new:true});
    res.json({
      message: " deleted successfully.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});

module.exports = router;
