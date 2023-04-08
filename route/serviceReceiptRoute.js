const express = require("express");
const mongoose = require("mongoose");
const route = express.Router();

const { serviceModel } = require("../models/serviceModel");
const { serviceReceiptModel,validateServiceReceipt } = require("../models/serviceReceiptModel");
const {transModel} = require("../models/TransectionModel");

route.get("/", async function (req, res) {
  try {
    const receiptData = await serviceReceiptModel.find().populate({
      path:"customerID",
      model:"customers",
      select:"_id name stdID code "
    }).populate({
        path:"serviceID",
        model:"services",
        select:"_id serviceName servicePrice "
      }).populate({
        path:"userID",
        model:"users",
        select:"_id  name "
      }).sort({createdAt: -1})
    ;
    res.send(receiptData);
  } catch (error) {}
});

route.get("/:id", async function (req, res) {
    try {
        const { id } = req.params;
  // return res.send(id);
  let receiptData;
  receiptData = await serviceReceiptModel.find({ Comp_Id: id })
  .populate({
    path:"feeID",
    model:"fee",
    select:"_id feeName studentEnrollmentID servicePrice Status"
  }).sort({createdAt: -1})


  res.send(receiptData);

    } catch (error) {
        res.send(error.message)
    }
  
});

route.post("/", async function (req, res) {
  try {
    
    const { error } = validateServiceReceipt(req.body);
    if (error) return res.send(error.details[0].message);
   
    // const receiptdata = await companyModel.findById(Comp_Id.trim());
    // if (!receiptdata) return res.status(404).send("given id was not found");

    let receiptNo = 0;
    let respnse=await serviceReceiptModel.find()
    let Nofdata=respnse.length
    receiptNo=parseInt(Nofdata+1)

    let receiptData = new serviceReceiptModel({
      serviceID: req.body.serviceID,
      customerID: req.body.customerID,
      userID: req.body.userID,
        receiptNo:receiptNo,
        phonePaid: req.body.phonePaid,
        phoneReceipt: req.body.phoneReceipt,
        AmountPaid: req.body.AmountPaid,
        datePaid: req.body.datePaid,
    });
    //  return res.send(receiptData)

    const serviceData = await serviceModel.findOne({
      _id: req.body.serviceID
    });
    if (!serviceData) return res.json({status:false,message:"fee not found"});
    //   return res.send(serviceData)

    // check invoice is full paid
    if (serviceData.Status=="fullpaid") return res.json({ status: false, message: "invoice amount all ready paid" });

    // check garey lacagta lagu leyahay iyo lacagta uu bixinayo yaa badan
    if (receiptData.AmountPaid > serviceData.Balance) return res.json({status: false,message: "your amount paid must less  or equal to your Amount due"});

    let Status = "";
    let currentBalance=0
    let currentAmountPaid=0

    currentAmountPaid=serviceData.AmountPaid+receiptData.AmountPaid
    currentBalance=serviceData.servicePrice-currentAmountPaid

    if (receiptData.AmountPaid < serviceData.Balance) {
      Status = "percialPaid"; 
    }
    if (receiptData.AmountPaid === serviceData.Balance) {
      Status = "fullPaid";
    }
    if (receiptData.AmountPaid === 0) {
      Status = "unpaid";
    }

  // return  res.send({
  //   Status,
  //   currentAmountPaid,
  //   currentBalance
  //   })
 //save garey waxana Receipt table
 let savedReceipt=await receiptData.save();


    // update garey lacagta invoice ka 
    //status,amountPaid, iyo balance ga
    const seriveUpdate= await serviceModel.findByIdAndUpdate(
        serviceData._id,
        {
          AmountPaid: currentAmountPaid,
          Balance: currentBalance,
          Status:Status
        },
        { new: true }
      );


      let transrespnse=await transModel.find()

     let tranLenth=transrespnse.length
      generatedNo = parseInt(tranLenth+1) ;
      const transInfo = new transModel({
        transectionNo: generatedNo,
        userID: req.body.userID,
        ServiceReceiptID: savedReceipt._id,
        name: serviceData.serviceName,
        type: "Service",
        transectionType: "income",
        description: `income from  ${serviceData.serviceName}`,
        amount: req.body.AmountPaid,
        date: req.body.datePaid,
      });
     await transInfo.save();


    
    res.json({
      status: true,
      message: "New Receipt added successfully",
      
    });
  } catch (error) {
    res.send(error.message);
  }
});

route.put("/:id", async (req, res) => {
  // let {cID}=mongoose.Types.ObjectId(req.params.id);
  try {
    const { id } = req.params;
    const receiptdata = await serviceReceiptModel.findById(id.trim());
    if (!receiptdata) return res.status(401).send("given id was not found");

  let updateObj ={
    serviceID: req.body.serviceID,
        customerID: req.body.customerID,
        phonePaid: req.body.phonePaid,
        phoneReceipt: req.body.phoneReceipt,
        AmountPaid: req.body.AmountPaid,
        datePaid: req.body.datePaid,
  }
    

      const receiptData = await serviceReceiptModel.findOne({
      _id: req.params.id
    });
      const serviceData = await serviceModel.findOne({
      _id: req.body.serviceID
    });
    if (!serviceData) return res.json({status:false,message:"fee not found"});
    //   return res.send(serviceData)

    // check invoice is full paid
    if (serviceData.Status=="fullpaid") return res.json({ status: false, message: "invoice amount all ready paid" });

    // check garey lacagta lagu leyahay iyo lacagta uu bixinayo yaa badan
    if (receiptData.AmountPaid > serviceData.Balance) return res.json({status: false,message: "your amount paid must less  or equal to your Amount due"});

    let getdifferenceAmount=0
    let Status = "";
    let currentBalance=0
    let currentAmountPaid=0

    if(updateObj.AmountPaid>receiptData.AmountPaid){
      getdifferenceAmount=updateObj.AmountPaid-receiptData.AmountPaid
      currentAmountPaid=serviceData.AmountPaid+getdifferenceAmount
      if(currentAmountPaid>serviceData.servicePrice) return res.json({status: false,message: "your amount paid must less  or equal to your Amount due"});
      currentBalance=serviceData.servicePrice-currentAmountPaid
      // console.log("plus needed")
    }else if(updateObj.AmountPaid<receiptData.AmountPaid){
      getdifferenceAmount=receiptData.AmountPaid-updateObj.AmountPaid
      currentAmountPaid=serviceData.AmountPaid-getdifferenceAmount
      currentBalance=serviceData.servicePrice-currentAmountPaid

      // console.log("minus needed")
    }else if(updateObj.AmountPaid==receiptData.AmountPaid){
      // nothing changed
      currentAmountPaid=serviceData.AmountPaid
      currentBalance=serviceData.Balance
      Status=serviceData.Status
    }
   
    if (currentAmountPaid < serviceData.servicePrice) {
      Status = "percialPaid"; 
    }
    if (currentAmountPaid===serviceData.servicePrice) {
      Status = "fullPaid";
    }
    if (currentAmountPaid === 0) {
      Status = "unpaid";
    }
    // return  res.send({
    //   getdifferenceAmount,
    //   currentAmountPaid,
    //   currentBalance,
    //   Status
    // })

    const updateReceipt = await serviceReceiptModel.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    const seriveUpdate= await serviceModel.findByIdAndUpdate(
      serviceData._id,
      {
        AmountPaid: currentAmountPaid,
        Balance: currentBalance,
        Status:Status
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
