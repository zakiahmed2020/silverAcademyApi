const express = require("express");
const route = express.Router();
const {subscriptionModel,validateSubscriptions,} = require("../models/subscriptionModel");


route.get("/", async function (req, res) {
try {
  let subscriptionData = await subscriptionModel.find().sort({createdAt: -1})

  res.send(subscriptionData);
  
} catch (error) {
  res.send(error.message)
}
 
});

route.post("/", async function (req, res) {
  try {
    const { error } = validateSubscriptions(req.body);
    if (error) return res.status(404).send(error.details[0].message);
   

    let subscriptionData = new subscriptionModel({
      subscriptoinTerm: req.body.subscriptoinTerm,
      amountPaid: req.body.amountPaid,
      PhonePaid: req.body.PhonePaid,
      accountType: req.body.accountType,
      datePaid: req.body.datePaid,
      expiredDate: req.body.expiredDate,
    });

   await subscriptionData.save();

  
    
    res.json({
      status: true,
      message: "New Subscription added successfully",
      
    });
  } catch (error) {
    res.send(error.message);
  }
});

route.put("/:id", async (req, res) => {
  // let {cID}=mongoose.Types.ObjectId(req.params.id);
  try {
    const { id } = req.params;
    const checkingID = await subscriptionModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const UpdatedInfo = await subscriptionModel.findByIdAndUpdate(
      req.params.id,
      {
        subscriptoinTerm: req.body.subscriptoinTerm,
        amountPaid: req.body.amountPaid,
        accountType: req.body.accountType,
        datePaid: req.body.datePaid,       
        expiredDate:req.body.expiredDate
      },
      { new: true }
    );
  
    res.json({
      status: true,
      message: "updated successfully",
    
    });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = route;
