const express = require("express");
const router = express.Router();

const {employeeModel,employeeValidation,} = require("../models/employeeModel");
router.get("/", async function (req, res) {
  try {
    const employeeData = await employeeModel.find().populate({
      path: "userID",
      model: "users",
      select: "_id name",
    }).sort({createdAt: -1});
    res.send(employeeData)
  } catch (error) {
    res.send(error.message)
  }
})
router.post("/", async function (req, res) {
 try {
  const { error } = employeeValidation(req.body);
  if (error) return res.json({status:false,message:error.details[0].message});
  
  const checkUsername = await employeeModel.findOne({ phone: req.body.phone });
  if (checkUsername) return res.json({status: false, message: "phone alreday exists..", })
  const employeeData = new employeeModel({
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    address: req.body.address,
    educationalLevel: req.body.educationalLevel,
    jobTitle: req.body.jobTitle,
    departmentWork: req.body.departmentWork,
    bloodType: req.body.bloodType,
    typeOfworking: req.body.typeOfworking,
    dateOfBirth: req.body.dateOfBirth,
    userID:req.body.userID,
    salaryAmount:req.body.salaryAmount,
    employeeStatus:req.body.employeeStatus,
  });
 

  await employeeData.save();
  res.json({
    message: "successfully inserted",
    status: true,
    info: employeeData,
  });
  
 } catch (error) {
  res.json({status:false,message:error.message});
 }
});
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params; 
    const checkingID = await employeeModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
    const employeeData = {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        address: req.body.address,
        educationalLevel: req.body.educationalLevel,
        jobTitle: req.body.jobTitle,
        departmentWork: req.body.departmentWork,
        bloodType: req.body.bloodType,
        typeOfworking: req.body.typeOfworking,
        dateOfBirth: req.body.dateOfBirth,
        salaryAmount:req.body.salaryAmount,
    };
   const upData = await  employeeModel.findByIdAndUpdate(req.params.id,
    employeeData,{new:true});
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
    const checkingID = await employeeModel.findById(id.trim());
    if(!checkingID) return res.status(404).send("given id was not found");
   
   const upData = await  employeeModel.findByIdAndUpdate(req.params.id,
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
