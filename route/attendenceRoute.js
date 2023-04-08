const express = require("express");
const router = express.Router();

const { attendenceModel , Validateattendence} = require("../models/attendenceModel");


router.get("/", async function (req, res) {
  try {
    const attendenceData = await attendenceModel.find().populate({
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
      }).populate({
        path:"teacherID",
        model:"teachers",
        select:"_id teacherName "
      }).populate({
        path:"userID",
        model:"users",
        select:"_id name "
      })
      .sort({ createdAt: -1 });
    res.send(attendenceData);
  } catch (error) {
    res.send(error.message);
  }
});
// router.get("/:id", async function (req, res) {
//   try {
//     const attendenceData = await attendenceModel
//       .findOne({ _id: req.params.id }).populate({
//         path:"studentID",
//         model:"student",
//         select:"_id studentName studentPhone studentStatus"
//       }).populate({
//         path:"courseID",
//         model:"courses",
//         select:"_id courseName coursePrice"
//       }).populate({
//         path:"classID",
//         model:"class",
//         select:"_id className teacherID classShift"
//       })
//       .sort({ createdAt: -1 });
//     res.send(attendenceData);
//   } catch (error) {
//     res.send(error.message);
//   }
// });

router.post("/", async function (req, res) {
  try {
    // const { error } = Validateattendence(req.body);
    // if (error)
    //   return res.json({ status: false, message: error.details[0].message });
    //  return res.send(req.body);

      // let genarateAttendence = req.body?.map(item => {
      //   return {
      //       studentID: item.studentID,
      //       courseID: item.courseID,
      //       classID: item.classID,
      //       userID: item.userID,
      //       teacherID: item.teacherID,
      
      //       day: item.day,
      //       attended:item.attended,
      //       attendenceStatus: item.attendenceStatus
      // }
      // });
    // return  res.send(genarateAttendence)

      // return res.json(feeGenerate)
    
        

    // const attendenceData = new attendenceModel({
    //     studentID: req.body.studentID,
    //   courseID: req.body.courseID,
    //   classID: req.body.classID,
    //   userID: req.body.userID,
    //   teacherID: req.body.teacherID,

    //   day: req.body.day,
    //   attanded: req.body.attanded,
    //   attendenceStatus: req.body.attendenceStatus,
    // });
   
    await attendenceModel.insertMany(req.body)
   
    
    res.json({
      message: "attendence successfully Register .",
      status: true,
    });
  } catch (error) {
    res.send({ status: false, message: error });
  }
});


router.delete("/:id", async function (req, res) {
  try {
    const attendence = await attendenceModel.findByIdAndRemove(req.params.id);
  if (!attendence) return res.status(400).send("ID was not found");
  res.send({status:true, message:"successfully deleted"});
  } catch (error) {
    res.send({status:true, message:error.message});
  }
});

module.exports = router;
