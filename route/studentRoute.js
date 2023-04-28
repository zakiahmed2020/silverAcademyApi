const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { studentModel, studentsValidation } = require("../models/studentModel");
const { UserModel} = require("../models/userModel");

router.get("/", async function (req, res) {
  try {
    const studentData = await studentModel.find().sort({ createdAt: -1 });
    res.send(studentData);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async function (req, res) {
  try {
    const studentData = await studentModel
      .findOne({ _id: req.params.id }).sort({ createdAt: -1 });
    res.send(studentData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = studentsValidation(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });

    const studentPhone = await studentModel.findOne({
      studentPhone: req.body.studentPhone,
    });
    if (studentPhone)
      return res.json({
        status: false,
        message: "Phone number  alreday exists..",
      });
      const checkUsername = await UserModel.findOne({ username: req.body.username });
  if (checkUsername) return res.json({
    message: `${req.body.username} email alreday exists..`,
    status: false,
  })
    let allstudents = await studentModel.find()
      let numberofStudents=parseInt(allstudents.length)+1

      let stdID="sa"+parseInt(2000+numberofStudents)

    const studentData = new studentModel({
      studentName: req.body.studentName,
      stdID: stdID,
      studentPhone: req.body.studentPhone,
      studentGender: req.body.studentGender,
      educationalLevel: req.body.educationalLevel,
      studentAddress: req.body.studentAddress,
      studentStatus: req.body.studentStatus,
    });
    // return res.send(studentData)

    let studentSavedData=await studentData.save();

    
    const userinfo = new UserModel({
      studentID:studentSavedData._id,
      name: req.body.studentName,
      phone:req.body.studentPhone,

      username: req.body.username,
      password: req.body.password,
      userType: "student",
      status: true,
   
    });
   
    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(userinfo.password, salt);
    await userinfo.save();
    res.json({
      message: "successfully created.",
      status: true,
      info: studentData,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await studentModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const studentData = {
      studentName: req.body.studentName,
      studentPhone: req.body.studentPhone,
      studentGender: req.body.studentGender,
      educationalLevel: req.body.educationalLevel,
      studentAddress: req.body.studentAddress,
      studentStatus: req.body.studentStatus,
    };
    const upData = await studentModel.findByIdAndUpdate(
      req.params.id,
      studentData,
      { new: true }
    );
    res.json({
      message: "successfully updated.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await studentModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");

    const upData = await studentModel.findByIdAndUpdate(
      req.params.id,
      { DeleteStatus: req.body.DeleteStatus },
      { new: true }
    );
    res.json({
      message: " deleted successfully.",
      status: true,
      info: upData,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
});

module.exports = router;
