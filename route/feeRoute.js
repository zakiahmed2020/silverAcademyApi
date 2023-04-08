const express = require("express");
const router = express.Router();

const { feeModel, validateFee } = require("../models/feeModel");
const { stdEnrollementModel } = require("../models/StdudentEnrollmentModel");
const { receiptModel } = require("../models/receiptModel");

router.get("/", async function (req, res) {
  try {
    const feeData = await feeModel.find().populate({
      path:"studentID",
      model:"student",
      select:"_id studentName stdID studentPhone studentStatus"
    }).populate({
      path:"courseID",
      model:"courses",
      select:"_id courseName coursePrice"
    }).populate({
      path:"classID",
      model:"class",
      select:"_id className teacherID classShift"
    }).sort({ createdAt: -1 });
    res.send(feeData);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async function (req, res) {
  try {
    const feeData = await feeModel
      .findOne({ _id: req.params.id })
      .populate({
        path:"studentID",
        model:"student",
        select:"_id studentName studentPhone studentStatus"
      })
      .sort({ createdAt: -1 });
    res.send(feeData);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function (req, res) {
  try {
    const { error } = validateFee(req.body);
    if (error)
      return res.json({ status: false, message: error.details[0].message });
      
    //   const courseName = await feeModel.findOne({ courseName: req.body.courseName });
    //   if (courseName) return res.json({status: false, message: "This course alreday exists..", })

            // feeName: "",
            // feetype: "",
            // classID:"",
            // feeAmount:""
            let fee = await feeModel.find()
            let feelenth=fee.length
            let stdGeeneratedFee=[]
            if(req.body.classID=="All"){
              let stdEnrolledAllClases = await stdEnrollementModel.find({enrolledStatus:"active"})
              stdGeeneratedFee=stdEnrolledAllClases
            }else{
              let stdEnrolledSpecificClass = await stdEnrollementModel.find({enrolledStatus:"active",classID:req.body.classID})
              stdGeeneratedFee=stdEnrolledSpecificClass
            }
            let generatedNo=100+feelenth

          let GeenerateFee=stdGeeneratedFee?.map(item => {
              return {
                feeNo:generatedNo++,
                  feeName: req.body.feeName,
                  feetype: req.body.feetype,
                  studentID: item.studentID,
                  courseID: item.courseID,
                  classID: item.classID,
                  feeAmount: req.body.feetype=="monthlyfee"? item.Amount:parseFloat(req.body.feeAmount),
                  feePaid: 0,
                  feeBalance: req.body.feetype=="monthlyfee"? item.Amount:parseInt(req.body.feeAmount),
                  feeStatus: 'unpaid',
            }
            });

  // return res.send(GeenerateFee)

    let saved=await feeModel.insertMany(GeenerateFee)
    
    // await feeData.save();
    res.json({
      message: "successfully generated fee.",
      status: true,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkingID = await feeModel.findById(id.trim());
    if (!checkingID) return res.status(404).send("given id was not found");
    const feeData = {
      feeName: req.body.feeName,
      studentEnrollmentID: req.body.studentEnrollmentID,
      feeAmount: req.body.feeAmount,
      feePaid: req.body.feePaid,
      feeBalance: req.body.feeBalance,
      feeStatus: req.body.feeStatus,
    };
    const upData = await feeModel.findByIdAndUpdate(req.params.id, feeData, {
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
  const  receiptdata=await receiptModel.find({ feeID: req.params.id})
  let receiptsNo=receiptdata?.map(d=>d.receiptNo)
  if(receiptdata.length > 0) return res.send({ status: false, message:`before you are deleting fee delete  receipt No ${receiptsNo}`})
  // return res.send(receiptdata)

  
  const feeinfo = await feeModel.findByIdAndRemove(req.params.id);
  if (!feeinfo) return res.status(400).send("ID was not found");
  res.send({status:true,message:"successfully deleted"});
});

module.exports = router;
