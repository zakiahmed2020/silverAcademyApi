const express = require("express");
const router = express.Router();

const {SubjectModel,validateSubject,} = require("../models/subjectsModel");

router.get("/", async function (req, res) {
  try {
    const subjectData = await SubjectModel.find().populate({
      path:"courseID",
      model:"courses",
      select:"_id courseName coursePrice"
    }).sort({createdAt: -1});
    res.send(subjectData)
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/:id", async function (req, res) {
  try {
    const subjectData = await SubjectModel.findOne({_id:req.params.id}).populate().sort({createdAt: -1});
    res.send(subjectData)
  } catch (error) {
    res.send(error.message)
  }
})

router.post("/", async function (req, res) {
 try {
  const { error } = validateSubject(req.body);
  if (error) return res.json({status:false,message:error.details[0].message});
  
  const courseName = await SubjectModel.findOne({ subjectName: req.body.subjectName });
  if (courseName) return res.json({status: false, message: "This Subject alreday resgistered..", })

  const subjectData = new SubjectModel({
    subjectName: req.body.subjectName,
    courseID: req.body.courseID,
  });
 

  await subjectData.save();
  res.json({
    message: "successfully registered.",
    status: true,
    info: subjectData,
  });
  
 } catch (error) {
  res.json({status:false,message:error.message});
 }
});
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await SubjectModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const subjectData = {
        subjectName: req.body.subjectName,
        courseID: req.body.courseID,
     
    };
   const upData = await  SubjectModel.findByIdAndUpdate(req.params.id,
    subjectData,{new:true});
    res.json({
      message: " successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({status:false,message:error.message}) 
  }
});


module.exports = router;
