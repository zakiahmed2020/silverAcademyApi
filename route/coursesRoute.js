const express = require("express");
const router = express.Router();

const {courseModel,validateCourse,} = require("../models/coursesModel");

router.get("/", async function (req, res) {
  try {
    const courseData = await courseModel.find().populate().sort({createdAt: -1});
    res.send(courseData)
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/:id", async function (req, res) {
  try {
    const courseData = await courseModel.findOne({_id:req.params.id}).populate().sort({createdAt: -1});
    res.send(courseData)
  } catch (error) {
    res.send(error.message)
  }
})

router.post("/", async function (req, res) {
 try {
  const { error } = validateCourse(req.body);
  if (error) return res.json({status:false,message:error.details[0].message});
  
  const courseName = await courseModel.findOne({ courseName: req.body.courseName });
  if (courseName) return res.json({status: false, message: "This course alreday exists..", })

  const courseData = new courseModel({
    courseName: req.body.courseName,
    coursePrice: req.body.coursePrice,
    courseLevel: req.body.courseLevel,
    courseDuration: req.body.courseDuration,
  });
 

  await courseData.save();
  res.json({
    message: "successfully created.",
    status: true,
    info: courseData,
  });
  
 } catch (error) {
  res.json({status:false,message:error.message});
 }
});
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await courseModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const courseData = {
        courseName: req.body.courseName,
        coursePrice: req.body.coursePrice,
        courseLevel: req.body.courseLevel,
        courseDuration: req.body.courseDuration,
     
    };
   const upData = await  courseModel.findByIdAndUpdate(req.params.id,
    courseData,{new:true});
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
    const checkingID = await courseModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
   
   const upData = await  courseModel.findByIdAndUpdate(req.params.id,
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
