const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {customerModel,vaidateCustomers,} = require("../models/customersModel");

router.get("/", async function (req, res) {
  try {
    const customerInfo = await customerModel.find();
    res.send(customerInfo);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = vaidateCustomers(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const checkPhone = await customerModel.findOne({ phone: req.body.phone });
    if (checkPhone)
      return res.json({
        message: "This customer Phone number alreday exists..",
        status: false,
      });

      let genNO = 1;
      let respnse=await customerModel.find()
        let noCustomer =respnse.length
        let code="cstcode"+parseInt(noCustomer+1)
        
    const customerInfo = new customerModel({
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      address: req.body.address,
      code: code,
    });
    
   let savedData= await customerInfo.save();
    res.json({
      message: "User Registered Successfully",
      status: true,
      info:savedData
    });
  } catch (err) {
    res.json({message:err.message,status: false});
  }
});

router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
    const checkingID = await customerModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const UpdatedInfo = await customerModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        email: req.body.email,
        address: req.body.address,
        // registerdate: req.body.registerdate,
        cutomerstatus: req.body.cutomerstatus,
      },
      { new: true }
    );
    res.json({status:true,message:"updated successfully",info:UpdatedInfo});
    } catch (error) {
      res.send(error.message)
    }
    
  });

router.delete("/:id", async function (req, res) {
  const expenseInfo = await customerModel.findByIdAndRemove(req.params.id);
  if (!expenseInfo) return res.status(400).send("ID was not found");
  res.send(expenseInfo);
});

module.exports = router;
