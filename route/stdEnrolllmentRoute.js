const express = require("express");
const router = express.Router();

const { stdEnrollementModel , validateEnrollment} = require("../models/StdudentEnrollmentModel");
const { feeModel } = require("../models/feeModel");
const { receiptModel} = require("../models/receiptModel");
const { attendenceModel } = require("../models/attendenceModel");
const {marksModel,} = require("../models/marksModel.js");

router.get("/", async function (req, res) {
  try {
    const EnrollemntData = await stdEnrollementModel
      .find()
      .populate({
        path:"studentID",
        model:"student",
        select:"_id studentName stdID studentPhone studentStatus"
      }).populate({
        path:"courseID",
        model:"courses",
        select:"_id courseName coursePrice"
      }).populate({
        path:"classID",
        model:"class",
        select:"_id className teacherID classShift"
      })
      .sort({ createdAt: -1 });
    res.send(EnrollemntData);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async function (req, res) {
  try {
    const EnrollemntData = await stdEnrollementModel
      .findOne({ _id: req.params.id }).populate({
        path:"studentID",
        model:"student",
        select:"_id studentName studentPhone studentStatus"
      }).populate({
        path:"courseID",
        model:"courses",
        select:"_id courseName coursePrice"
      }).populate({
        path:"classID",
        model:"class",
        select:"_id className teacherID classShift"
      })
      .sort({ createdAt: -1 });
    res.send(EnrollemntData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = validateEnrollment(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });

    const studentAndClassCheck = await stdEnrollementModel.findOne({
      studentID: req.body.studentID,classID:req.body.classID,
    });
    if (studentAndClassCheck)
      return res.json({
        status: false,
        message: "This student alreday enrolled this class..",
      });

    const EnrollemntData = new stdEnrollementModel({
        studentID: req.body.studentID,
      courseID: req.body.courseID,
      classID: req.body.classID,
      enrolledDate: req.body.enrolledDate,
      Amount: req.body.Amount,
      enrolledStatus: req.body.enrolledStatus,
    });
    let fee = await feeModel.find()
    let feelenth=fee.length
    const FeeGenerate = req.body.items.map((item)=>{
      return {
        studentID: req.body.studentID,
      courseID: req.body.courseID,
      classID: req.body.classID,

      feetype: item.feetype,
      feeNo:100+feelenth+1,
      feeName: item.feeName,
      feeAmount:item.feeAmount,
      feePaid: 0,
      feeBalance:item.feeAmount

      }

    })
      
  //  return res.send(FeeGenerate)
   
    let saved=await feeModel.insertMany(FeeGenerate)
    await EnrollemntData.save();
   
    res.json({
      message: "successfully enrolled and also generate fee.",
      status: true,
      info: EnrollemntData,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await stdEnrollementModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const EnrollemntData = {
      studentID: req.body.studentID,
      courseID: req.body.courseID,
      classID: req.body.classID,
      enrolledDate: req.body.enrolledDate,
      Amount: req.body.Amount,
      enrolledStatus: req.body.enrolledStatus,
    };
    const upData = await stdEnrollementModel.findByIdAndUpdate(
      req.params.id,
      EnrollemntData,
      { new: true }
    );
    res.json({
      message: " successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const enrollmentobj = await stdEnrollementModel.findOne({_id:req.params.id});

    const  stdmarks=await marksModel.find({ studentID: enrollmentobj.studentID,classID:enrollmentobj.classID})
    const  stdreceipt=await receiptModel.find({ studentID: enrollmentobj.studentID,classID:enrollmentobj.classID})
    const  stdfee=await feeModel.find({ studentID: enrollmentobj.studentID,classID:enrollmentobj.classID})
    const  stdAttendence=await attendenceModel.find({ studentID: enrollmentobj.studentID,classID:enrollmentobj.classID})

    if(stdfee.length > 0) return res.send({ status: false, message:`before you are deleting student enrollment please delete student's fee  `})
    if(stdreceipt.length > 0) return res.send({ status: false, message:`before you are deleting student enrollment please delete student's receipts  `})
    if(stdmarks.length > 0) return res.send({ status: false, message:`before you are deleting student enrollment please delete student's marks  `})
    if(stdAttendence.length > 0) return res.send({ status: false, message:`before you are deleting student enrollment please delete student's Attendence  `})

    const enrollment = await stdEnrollementModel.findByIdAndRemove(req.params.id);
  if (!enrollment) return res.status(400).send("ID was not found");
  res.send({status:true, message:"successfully deleted"});
  } catch (error) {
    res.send({status:false, message:error.message});
  }
});


module.exports = router;
