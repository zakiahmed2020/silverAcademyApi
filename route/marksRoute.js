const express = require("express");
const router = express.Router();

const {marksModel,validateMarks,} = require("../models/marksModel.js");

router.get("/", async function (req, res) {
  try {
    const marksData = await marksModel.find().populate({
        path:"studentID",
        model:"student",
        select:"_id studentName stdID studentPhone studentStatus"
      }).populate({
        path:"classID",
        model:"class",
        select:"_id className teacherID classShift"
      }).populate({
        path:"subjectID",
        model:"subjects",
        select:"_id subjectName courseID"
      }).sort({createdAt: -1});
    res.send(marksData)
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/:id", async function (req, res) {
  try {
    const marksData = await marksModel.findOne({_id:req.params.id}).populate().sort({createdAt: -1});
    res.send(marksData)
  } catch (error) {
    res.send(error.message)
  }
})

router.post("/", async function (req, res) {
 try {
  const { error } = validateMarks(req.body);
  if (error) return res.json({status:false,message:error.details[0].message});
  
  const courseName = await marksModel.findOne({ subjectID: req.body.subjectID, 
    studentID: req.body.studentID,classID: req.body.classID});
  if (courseName) return res.json({status: false, message: "This student alreday resgistered marks..", })

  const marksData = new marksModel({
    studentID: req.body.studentID,
    subjectID: req.body.subjectID,
    classID: req.body.classID,
    Amount: req.body.Amount,
  });
 

  await marksData.save();
  res.json({
    message: "successfully registered.",
    status: true,
    info: marksData,
  });
  
 } catch (error) {
  res.json({status:false,message:error.message});
 }
});

router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await marksModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const marksData = {
        studentID: req.body.studentID,
        subjectID: req.body.subjectID,
        courseID: req.body.courseID,
        Amount: req.body.Amount,
    };
   const upData = await  marksModel.findByIdAndUpdate(req.params.id,
    marksData,{new:true});
    res.json({
      message: " successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const marks = await marksModel.findByIdAndRemove(req.params.id);
  if (!marks) return res.status(400).send("ID was not found");
  res.send({status:true, message:"successfully deleted"});
  } catch (error) {
    res.send({status:true, message:error.message});
  }
});
module.exports = router;
