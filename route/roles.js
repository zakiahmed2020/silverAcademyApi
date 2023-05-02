const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { roleModel, validateRoles } = require("../models/rolesModel");

router.get("/", async function (req, res) {
  try {
    const rolesInfo = await roleModel.find();
    let roles = rolesInfo.filter(r => r.role!="superAdmin");
    res.send(roles);
  } catch (error) {
    res.send(error);
  }
});
router.get("/:id", async function (req, res) {
  try {
    const rolesInfo = await roleModel.findById(req.params.id);
    res.send(rolesInfo);
  } catch (error) {
    res.status(500).send({ status: false, message: err.message });
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = validateRoles(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rolesInfo = new roleModel({
      permissions: req.body.permissions,
      role: req.body.role,
    });
    await rolesInfo.save();
    res.json({
      message: "Role Registered Successfully",
      status: true,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await roleModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const roleData = {
      permissions: req.body.permissions,
      role: req.body.role,
    };
    const upData = await roleModel.findByIdAndUpdate(req.params.id, roleData, {
      new: true,
    });
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
    console.log(req.params.id);
    // return res.send(req.params.id);
    const transInfo = await roleModel.findOne({_id: req.params.id});
    if (!transInfo) return res.status(400).send("ID was not found");
    const transdata = await roleModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "deleted successfully.",
      status: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
      status: true,
    });
  }
});
module.exports = router;
