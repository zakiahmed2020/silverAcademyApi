const express = require("express");
const router = express.Router();

const {transModel,validateTransections,} = require("../models/TransectionModel");

router.get("/", async function (req, res) {
 try {
    let Transection = await transModel.find().populate({
        path:"userID",
        model:"users",
        select:"_id name phone "
      })
    res.send(Transection);
 } catch (error) {
    res.send(error.message);
 }
});

router.post("/", async function (req, res) {
  try {
  const { error } = validateTransections(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

   
    if (req.body.transectionType == "expense" && balance < req.body.amount) {
        return res.json({
        message:
          `your balance is un suffienct your balance is ${balance}  and you went to expense ${req.body.amount}`,
        status: false,
      });
    }

  let generatedNo = 1;
  let [respnse]=await transModel.find({})
    .sort({ createdAt: -1 })
    .limit(1)
    if(respnse){
      generatedNo = respnse.transectionNo+1;
    }else{    
        generatedNo=1;
    }
  const transInfo = new transModel({
    transectionNo: generatedNo,
    userID: req.body.userID,
    receiptID: req.body.receiptID,
    name: req.body.name,
    type: req.body.type,
    transectionType: req.body.transectionType,
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,
  });
  
      await transInfo.save();
      res.json({
        message: " successfully inserted.",
        status: true,
        info: transInfo,
      });
    // }
  } catch (error) {
    res.send(error.message);
    // console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  const {id} = req.params; 
  // const checkingID = await transModel.findById(id.trim());
  // if(!checkingID) return res.status(404).send("given id was not found");
  // const getTransaction = transModel.findById((c) => c._id === parseInt(id));
  // console.log(getTransaction)
  // if (!getTransaction) res.status(404).send("The transections ID was not found");

  const transInfo = {
    name: req.body.name,
    type: req.body.type,
    transectionType: req.body.transectionType,
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,date:req.body.date,
    description: req.body.description,
    amount: req.body.amount,
  };

 const upData = await  transModel.findByIdAndUpdate(req.params.id,
  transInfo,{new:true});
  res.json({
    message: " successfully updated.",
    status: true,
    info: upData,
  });
});

router.delete("/:id", async function (req, res) {
  try {
    const transInfo = await transModel.findByIdAndRemove(req.params.id);
  if (!transInfo) return res.status(400).send("ID was not found");
  res.send({status:true, message:"successfully deleted"});
  } catch (error) {
    res.send({status:true, message:error.message});
  }
});
module.exports = router;
