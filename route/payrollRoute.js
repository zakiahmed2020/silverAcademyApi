const express = require("express");
const router = express.Router();

const { payrollModel, ValidatePayroll } = require("../models/payrollModel");
const { employeeModel } = require("../models/employeeModel");
const { receiptModel } = require("../models/receiptModel");
const {
  transModel,
} = require("../models/TransectionModel");
const { text } = require("body-parser");
router.get("/", async function (req, res) {
  try {
    const feeData = await payrollModel
      .find()
      .populate({
        path: "employeeID",
        model: "employee",
        select: "_id name phone",
      })
      .populate({
        path: "userID",
        model: "users",
        select: "_id name phone",
      })
      .sort({ createdAt: -1 });
    res.send(feeData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = ValidatePayroll(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });

    let payroll = await payrollModel.find();
    let feelenth = payroll.length;

    let generatedNo = 1 + feelenth;

    let GeenerateFee = req.body.employee?.map((item) => {
      return {
        feeNo: generatedNo++,
        feetype: req.body.feetype,
        monthly: req.body.monthly,
        Year: req.body.Year,
        employeeID: item._id,
        userID: req.body.userID,
        Amount:
          req.body.feetype == "salary" ? item.salaryAmount : req.body.Amount,
      };
    });

    const IncomeData = await transModel.find({ transectionType:"income" });
  const expenseData = await transModel.find({ transectionType:"expense" });
 
  const totalIncome = IncomeData.reduce(
    (total, item) => total + item.amount,
    0
  );
  const TotalExpense = expenseData.reduce(
    (total, item) => total + item.amount,
    0
  );
  let balance = totalIncome - TotalExpense;

let totalAmountPayroll=0
    const AmountPayrol = req.body.employee.reduce(
      (total, item) => total + item.salaryAmount,
      0
    );

    if(req.body.feetype=="salary"){
      totalAmountPayroll=AmountPayrol
    }else{
      let noOfEmploye=req.body.employee.length
      let amount=noOfEmploye*req.body.Amount
      totalAmountPayroll=amount

    }
    // console.log(totalAmountPayroll,balance)

    if(totalAmountPayroll>balance) return res.json({
      message:
        `your balance is un suffienct your balance is ${balance.toFixed(2)}  and you went to paid ${totalAmountPayroll.toFixed(2)}`,
      status: false,
    });
 


    let generatedtranNo = 1;
  let [respnse]=await transModel.find({})
    .sort({ createdAt: -1 })
    .limit(1)
    if(respnse){
      generatedtranNo = respnse.transectionNo;
    }else{    
      generatedtranNo=1;
    }
    let GeenerateExpense = req.body.employee?.map((item) => {
      return {
        transectionNo: generatedtranNo++,
        name: "utility",
        type: req.body.feetype,
        transectionType: "expense",
        description: item.name + ", " + req.body.feetype+", "+req.body.monthly+", "+req.body.Year,
        amount:1,
        date: new Date(),
      };
    });

    // return res.send(GeenerateExpense)

    let saved = await payrollModel.insertMany(GeenerateFee);
    let savedexpense = await transModel.insertMany(GeenerateExpense);

    // await feeData.save();
    res.json({
      message: "successfully generated payroll.",
      status: true,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await payrollModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const feeData = {
      feetype: req.body.feetype,
      monthly: req.body.monthly,
      Year: req.body.Year,
      employeeID: req.body.employeeID._id,
      Amount: req.body.Amount,
    };
    const upData = await payrollModel.findByIdAndUpdate(
      req.params.id,
      feeData,
      {
        new: true,
      }
    );
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
  const receiptdata = await receiptModel.find({ feeID: req.params.id });
  let receiptsNo = receiptdata?.map((d) => d.receiptNo);
  if (receiptdata.length > 0)
    return res.send({
      status: false,
      message: `before you are deleting fee delete  receipt No ${receiptsNo}`,
    });
  // return res.send(receiptdata)

  const feeinfo = await payrollModel.findByIdAndRemove(req.params.id);
  if (!feeinfo) return res.status(400).send("ID was not found");
  res.send({ status: true, message: "successfully deleted" });
});

module.exports = router;
