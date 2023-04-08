const express = require("express");
const router = express.Router();

const { serviceModel, validateService } = require("../models/serviceModel");


router.get("/", async function (req, res) {
  try {
    const ServiceData = await serviceModel.find().populate({
      path:"customerID",
      model:"customers",
      select:"_id name phone "
    }).populate({
      path:"userID",
      model:"users",
      select:"_id  name "
    }).sort({createdAt: -1}).sort({ createdAt: -1 });
    res.send(ServiceData);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async function (req, res) {
  try {
    const ServiceData = await serviceModel
      .findOne({ _id: req.params.id })
      .populate({
        path:"customerID",
        model:"customers",
        select:"_id name phone "
      }).sort({ createdAt: -1 });
    res.send(ServiceData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = validateService(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });
      
      const serviceData = new serviceModel({
        serviceName: req.body.serviceName,
        customerID: req.body.customerID,
        servicePrice: req.body.servicePrice,     
        userID: req.body.userID, 
        Balance: req.body.servicePrice,    
      });       
    let saved=await serviceData.save()
    // await ServiceData.save();
    res.json({
      message: "successfully inserted.",
      status: true,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await serviceModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const ServiceData = {
        serviceName: req.body.serviceName,
        customerID: req.body.customerID,
        servicePrice: req.body.servicePrice,     
    };
    const upData = await serviceModel.findByIdAndUpdate(req.params.id, ServiceData, {
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



module.exports = router;
