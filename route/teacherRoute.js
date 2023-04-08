const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { UserModel, validateUsers } = require("../models/userModel");
const { teacherModel, teacherValidation } = require("../models/teacherModel");

router.get("/", async function (req, res) {
  try {
    const teacherData = await teacherModel.find().sort({ createdAt: -1 });
    res.send(teacherData);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async function (req, res) {
  try {
    const teacherData = await teacherModel
      .findOne({ _id: req.params.id }).sort({ createdAt: -1 });
    res.send(teacherData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = teacherValidation(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });

    const teacherPhone = await teacherModel.findOne({
      teacherPhone: req.body.teacherPhone,
    });
    if (teacherPhone)
      return res.json({
        status: false,
        message: "Phone number  alreday exists..",
      });
      const checkUsername = await UserModel.findOne({ username: req.body.username });
  if (checkUsername) return res.json({
    message: "This username alreday exists..",
    status: false,
  })

    const teacherData = new teacherModel({
      teacherName: req.body.teacherName,
      teacherPhone: req.body.teacherPhone,
      teacherGender: req.body.teacherGender,
      educationalLevel: req.body.educationalLevel,
      teacherAddress: req.body.teacherAddress,
      employeeStatus: req.body.employeeStatus,
    });

    let teacherDatasaved=await teacherData.save();

    const userinfo = new UserModel({
      teacherID:teacherDatasaved._id,
      name: req.body.teacherName,
      phone:req.body.teacherPhone,
      username: req.body.username,
      password: req.body.password,
      userType: "teacher",
      status: true,
   
    });
    // return res.send(userinfo)
    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(userinfo.password, salt);
    await userinfo.save();

    res.json({
      message: "successfully created.",
      status: true,
      info: teacherData,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await teacherModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const teacherData = {
      teacherName: req.body.teacherName,
      teacherPhone: req.body.teacherPhone,
      teacherGender: req.body.teacherGender,
      educationalLevel: req.body.educationalLevel,
      teacherAddress: req.body.teacherAddress,
      employeeStatus: req.body.employeeStatus,
    };
    const upData = await teacherModel.findByIdAndUpdate(
      req.params.id,
      teacherData,
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
    const checkingID = await teacherModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");

    const upData = await teacherModel.findByIdAndUpdate(
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
