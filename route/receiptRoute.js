const express = require("express");
const mongoose = require("mongoose");
const route = express.Router();

const { feeModel } = require("../models/feeModel");
const { receiptModel, validateReceipt } = require("../models/receiptModel");
const { transModel } = require("../models/TransectionModel");

route.get("/", async function (req, res) {
  try {
    const receiptData = await receiptModel
      .find()
      .populate({
        path: "studentID",
        model: "student",
        select: "_id studentName stdID studentPhone studentStatus",
      })
      .populate({
        path: "feeID",
        model: "fee",
        select: "_id feeName feeNo studentEnrollmentID feeAmount feeStatus",
      })
      .populate({
        path: "userID",
        model: "users",
        select: "_id  name ",
      })
      .sort({ createdAt: -1 });
    res.send(receiptData);
  } catch (error) {}
});

route.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    // return res.send(id);
    let receiptData;
    receiptData = await receiptModel
      .find({ Comp_Id: id })
      .populate({
        path: "feeID",
        model: "fee",
        select: "_id feeName studentEnrollmentID feeAmount feeStatus",
      })
      .sort({ createdAt: -1 });

    res.send(receiptData);
  } catch (error) {
    res.send(error.message);
  }
});

route.post("/", async function (req, res) {
  try {
    const { error } = validateReceipt(req.body);
    if (error) return res.send(error.details[0].message);
    // const { Comp_Id } = req.body;

    // const receiptdata = await companyModel.findById(Comp_Id.trim());
    // if (!receiptdata) return res.status(404).send("given id was not found");

    let receiptDataRNO = await receiptModel.find();

    let receiptNo = "RN" + (100 + receiptDataRNO.length + 1);

    let receiptData = new receiptModel({
      feeID: req.body.feeID,
      studentID: req.body.studentID,
      userID: req.body.userID,
      receiptNo: receiptNo,
      phonePaid: req.body.phonePaid,
      phoneReceipt: req.body.phoneReceipt,
      AmountPaid: req.body.AmountPaid,

      receiptStatus: req.body.receiptStatus,
      datePaid: req.body.datePaid,
      feeStatus: req.body.feeStatus,
    });
    //  return res.send(receiptData)
    const FeeData = await feeModel.findOne({
      _id: req.body.feeID,
    });
    if (!FeeData) return res.json({ status: false, message: "fee not found" });
    //   return res.send(FeeData)

    // check invoice is full paid
    if (FeeData.feeStatus == "fullpaid")
      return res.json({
        status: false,
        message: "invoice amount all ready paid",
      });

    // check garey lacagta lagu leyahay iyo lacagta uu bixinayo yaa badan
    if (receiptData.AmountPaid > FeeData.feeBalance)
      return res.json({
        status: false,
        message: "your amount paid must less  or equal to your Amount due",
      });

    let feeStatus = "";
    let currentBalance = 0;
    let currentAmountPaid = 0;
    // caculate gareysa amount lagu leyahy iyo amount uu wado ka dibna isku dar
    currentAmountPaid = FeeData.feePaid + receiptData.AmountPaid;
    // lacagta lagu leyahay waxa ka jarta lacagta uu bxiyay
    currentBalance = FeeData.feeAmount - currentAmountPaid;
    //   waxad check gareysa amount uu wado iyo amount lagu leyahay yaa yar
    // hadii amount uu wado uu yar yahay receiptStatus waxa ka dhigta percialPaid
    if (receiptData.AmountPaid < FeeData.feeBalance) {
      feeStatus = "percialPaid";
      //   waxad check gareysa amount uu wado iyo amount lagu leyahay ma isla egyihiin
      // hadii haa tahay receiptStatus waxa ka dhigta fullPaid
    }
    if (receiptData.AmountPaid === FeeData.feeBalance) {
      feeStatus = "fullPaid";
    }
    if (receiptData.AmountPaid === 0) {
      feeStatus = "unpaid";
    }

    //   return  res.send({
    //     feeStatus,
    //     currentAmountPaid,
    //     currentBalance
    //     })
    //save garey waxana Receipt table
    let savedReceipt = await receiptData.save();

    // update garey lacagta invoice ka
    //status,amountPaid, iyo balance ga
    const Updatefee = await feeModel.findByIdAndUpdate(
      FeeData._id,
      {
        feePaid: currentAmountPaid,
        feeBalance: currentBalance,
        feeStatus: feeStatus,
      },
      { new: true }
    );

    let receiptDataObj = await receiptModel.findOne({ _id: savedReceipt._id });

    //  save as income

    let transData = await transModel.find();
    let generatedNo = transData.length + 1;
    const transInfo = new transModel({
      transectionNo: generatedNo,
      userID: req.body.userID,
      receiptID: savedReceipt._id,
      name: "student income",
      type: "monthly fee",
      transectionType: "income",
      description: `income from student `,
      amount: req.body.AmountPaid,
      date: req.body.datePaid,
    });
    await transInfo.save();

    res.json({
      status: true,
      message: "New Receipt added successfully",
      info: receiptDataObj,
    });
  } catch (error) {
    res.send(error.message);
  }
});

route.put("/:id", async (req, res) => {
  // let {cID}=mongoose.Types.ObjectId(req.params.id);
  try {
    return res.send({
      status: false,
      message: "dear client this is under process coming soon wil be available",
    });
    const { id } = req.params;
    const receiptdata = await receiptModel.findById(id.trim());
    if (!receiptdata) return res.status(401).send("given id was not found");

    const FeeData = await receiptModel.findOne({ _id: req.body.feeID });
    if (!FeeData) return res.send("given invoice No was not found");

    let receiptAmountUpdated = 0;
    let invoiceamountPaid = 0;
    let invamountPaid = 0;
    let feeStatus = "";
    let Invoicebalance = 0;

    if (receiptdata.AmountPaid > req.body.amountPaid) {
      // lacagta horay u bixiyay iyo lacagta uu hada wado kala jar
      //asigo horay gacanta uga dhcaday $80 inuu qabtay lkin lacagta uu qabtay ey tahay $60
      // lacagti hore ka jar lacagta hada uuwado kadib na haraga soo baxo waxad ka
      // jarta lacagti horay u keydsaned
      if (req.body.amountPaid < 0) {
        return res.send({
          status: false,
          message: "please enter amount valid amount not allowed less then 0",
        });
      }
      // bari halkan ka bilow
      let CurrentAmount = receiptData.AmountPaid - req.body.amountPaid;

      receiptAmountUpdated = req.body.amountPaid;

      invoiceamountPaid = FeeData.feePaid - CurrentAmount;

      invamountPaid = invoiceamountPaid;

      Invoicebalance = FeeData.Total - invoiceamountPaid;

      // console.log("difference",CurrentAmount)
      // console.log("receipt amount",receiptAmountUpdated)
      // console.log("invoice amount paid ",invoiceamountPaid)
      // console.log("invoive balance",Invoicebalance)
      // return res.send("minus ready")

      if (invoiceamountPaid == 0) {
        feeStatus = "due";
      } else {
        feeStatus = "percialPaid";
      }
    } else if (receiptdata.AmountPaid < req.body.amountPaid) {
      // lacagta horay u bixiyay iyo lacagta uu hada wado kala jar
      //asigo horay gacanta uga dhcaday $60 inuu qabtay lkin lacagta uu qabtay ey tahay $90
      // lacagti hore ka jar lacagta hada uuwado kadib na haraga soo baxo waxad ka
      // kudarta lacagti horay u keydsaned
      if (req.body.amountPaid < 0) {
        return res.send({
          status: false,
          message: "please enter amount valid amount not less then 0",
        });
      }

      let CurrentAmount = req.body.amountPaid - receiptdata.AmountPaid;
      // invoiceamountPaid=receiptData.AmountPaid+CurrentAmount

      invoiceamountPaid = FeeData.feePaid + CurrentAmount;
      invamountPaid = invoiceamountPaid;
      receiptAmountUpdated = req.body.amountPaid;
      if (invoiceamountPaid > FeeData.Total) {
        return res.send({
          status: false,
          message: "your amount paid must less  or equal to your Total Amount",
        });
      }

      Invoicebalance = FeeData.Total - invoiceamountPaid;

      // console.log("difference",CurrentAmount)
      // console.log("receipt amount",receiptAmountUpdated)
      // console.log("invoive amount paid",invoiceamountPaid)
      // console.log("invoive balance",Invoicebalance)
      // return res.send("plus ready")

      if (FeeData.Total == invoiceamountPaid) {
        feeStatus = "fullPaid";
      } else {
        feeStatus = "percialPaid";
      }
    } else if (req.body.amountPaid == receiptData.AmountPaid) {
      receiptAmountUpdated = req.body.amountPaid;
      invamountPaid = FeeData.feePaid;
      feeStatus = FeeData.status;
      Invoicebalance = FeeData.feeBalance;
      // console.log("same")
    }
    let invObj = {
      amountPaid: invamountPaid,
      balance: Invoicebalance,
      status: feeStatus,
    };
    // return res.send(invObj)

    const updateReceipt = await receiptModel.findByIdAndUpdate(
      req.params.id,
      {
        studentID: req.body.studentID,
        feeID: req.body.feeID,
        phonePaid: req.body.phonePaid,
        phoneReceipt: req.body.phoneReceipt,
        amountPaid: receiptAmountUpdated,
        accountType: req.body.accountType,
        datePaid: req.body.datePaid,
      },
      { new: true }
    );
    const UpdateInvoice = await receiptModel.findByIdAndUpdate(
      FeeData._id,
      {
        amountPaid: invamountPaid,
        balance: Invoicebalance,
        status: feeStatus,
      },
      { new: true }
    );
    let receiptDataMObj = await receiptModel.findOne({
      _id: updateReceipt._id,
    });
    res.json({
      status: true,
      message: "updated successfully",
      info: receiptDataMObj,
    });
  } catch (error) {
    res.send(error.message);
  }
});

route.delete("/:id", async function (req, res) {
  try {
    const transectionData = await transModel.findOne({
      receiptID: req.params.id,
    });
    // let transNo=transectionData?.map(d=>d.transectionNo+",")
    // if(transectionData.length > 0) return res.send({ status: false, message:`before you are deleting receipt  please delete  income No ${transNo}`})

    const receiptData = await receiptModel.findOne({
      _id: req.params.id,
    });
    const FeeData = await feeModel.findOne({
      _id: receiptData.feeID,
    });

    let feeStatus = "";
    let currentAmountPaid = FeeData.feePaid - receiptData.AmountPaid;
    let currentBalance = FeeData.feeAmount - currentAmountPaid;

    if (currentAmountPaid < FeeData.feeAmount) {
      feeStatus = "percialPaid";
    }
    // if (currentAmountPaid === FeeData.feeAmount) {
    //   feeStatus = "fullPaid";
    // }
    if (currentAmountPaid === 0) {
      feeStatus = "unpaid";
    }

    // return res.send({currentAmountPaid,currentBalance,feeStatus})
    const Updatefee = await feeModel.findByIdAndUpdate(
      FeeData._id,
      {
        feePaid: currentAmountPaid,
        feeBalance: currentBalance,
        feeStatus: feeStatus,
      },
      { new: true }
    );
    const feeinfo = await receiptModel.findByIdAndRemove(req.params.id);
    const deletedTrans = await transModel.findByIdAndRemove(
      transectionData._id
    );
    if (!feeinfo) return res.status(400).send("ID was not found");
    res.send({
      status: true,
      message: "successfully deleted receipt and his income",
    });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
});

module.exports = route;
