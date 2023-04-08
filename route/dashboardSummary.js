const express = require("express");
const moment = require("moment");
const router = express.Router();



// number of 
const { studentModel} = require("../models/studentModel");
const { UserModel} = require("../models/userModel");
const {transModel} = require("../models/TransectionModel");
const {classModel} = require("../models/classModel");
const {courseModel} = require("../models/coursesModel");
const { teacherModel} = require("../models/teacherModel");
const {employeeModel} = require("../models/employeeModel");

const { attendenceModel , } = require("../models/attendenceModel");
const { feeModel } = require("../models/feeModel");
const { stdEnrollementModel } = require("../models/StdudentEnrollmentModel");
const { receiptModel } = require("../models/receiptModel");

// router.get("/", async function (req, res) {

//   try {
//     const { companyID} =  req.params;

//     const deptsTakenUSD = await deptModel.find({deptType:"taken",currencyType:"USD"});
//     const deptsTakenUGX = await deptModel.find({deptType:"taken",currencyType:"UGX"});
    
//     const deptsDataReturnUSD = await deptModel.find({deptType:"return",currencyType:"USD"});
//     const deptsReturnUGX = await deptModel.find({deptType:"return",currencyType:"UGX"});
    
    
//     const DepositUSD = await transModel.find({transectionType:"deposit",currencyType:"USD"});
//     const DepositUGX = await transModel.find({transectionType:"deposit",currencyType:"UGX"});
    
//     const withDrawUSD = await transModel.find({transectionType:"withdraw",currencyType:"USD"});
//     const withDrawUGX = await transModel.find({transectionType:"withdraw",currencyType:"UGX"});
    
//     const transections = await transModel.find();
//     const customers = await customerModel.find();
//     const Users = await UserModel.find();
  
//     let numberOfCustomers = customers.length;
//     let numberOftransections = transections.length;
//     let numberOfUsers = Users.length;

//     const totalDepstsinTakenUSD = deptsTakenUSD.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     const totalDepstsinTakenUGX = deptsTakenUGX.reduce(
//       (total, item) => total + item.amount,
//       0
//     );

//     const totalDepstsinReturnUSD = deptsDataReturnUSD.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     const totalDeptsReturnUGX = deptsReturnUGX.reduce(
//       (total, item) => total + item.amount,
//       0
//     );

//     const TotalDepositUSD = DepositUSD.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     const TotalDepositUGX = DepositUGX.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     const TotalwithDrawUSD = withDrawUSD.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     const TotalwithDrawUGX = withDrawUGX.reduce(
//       (total, item) => total + item.amount,
//       0
//     );
//     let DepstUSDBalance=totalDepstsinTakenUSD-totalDepstsinReturnUSD
//     let DepstUGXBalance=totalDepstsinTakenUGX-totalDeptsReturnUGX

//     let UsdBalance=TotalDepositUSD-TotalwithDrawUSD
//     let UGXBalance=TotalDepositUGX-TotalwithDrawUGX

//     const summaryData = {
//         TotalDepositUSD,
//         TotalDepositUGX,
//         TotalwithDrawUSD,
//         TotalwithDrawUGX,
//         UsdBalance,
//         UGXBalance,
      
//       numberOfUsers,
//       numberOfCustomers,
//       numberOftransections,

//       totalDepstsinTakenUSD,
//       totalDepstsinReturnUSD,
//       DepstUSDBalance, 
//       totalDepstsinTakenUGX,
//       totalDeptsReturnUGX,
//       DepstUGXBalance
      
     
//     };
    
//     res.json(summaryData);
//   } catch (error) {
//     res.send(error.message);
//   }
// });
// owners reports his company
router.get("/", async function (req, res) {

  try {
    let getData= async(model)=>{
        const data = await model.find()
        return data
    }
    
    let studentData = await getData(studentModel)
    let teachersData = await getData(teacherModel)
    let usersData = await getData(UserModel)
    let transectionsData = await getData(transModel)
    let classData = await getData(classModel)
    let courseData = await getData(courseModel)
    let employeeData = await getData(employeeModel)
    let receiptData = await getData(receiptModel)
    let enrollmentData = await getData(stdEnrollementModel)
    let feeData = await getData(feeModel)

    var currMonthName  = moment().format('MMMM');
    // get day // let todaysName=moment().format('dddd');

   var prevMonthName  = moment().subtract(1, "month").format('MMMM'); 
  

  let CurrentMonthlyTrans = transectionsData?.filter((item) => {
    let date = moment(item.createdAt).format("MMMM");
    return date == currMonthName 
  }); 
  let currentMonthIncomeData= CurrentMonthlyTrans.filter(trans => trans.transectionType == 'income')
  let currentMonthExpenseData= CurrentMonthlyTrans.filter(trans => trans.transectionType == 'expense')
// return res.send(currentMonthIncomeData)
  let currentMonthIncome = currentMonthIncomeData.reduce(
    (total, item) => total + item.amount,
    0
  );
  let currentMonthExpense = currentMonthExpenseData.reduce(
    (total, item) => total + item.amount,
    0
  );



    let NumberOfstudents = studentData.length
    let NumberOfEnrolledStudents = enrollmentData.length;
    let NumberOfUsers = usersData.length;
    let NumberOfTeachers = teachersData.length;

    let NumberOfTransections = transectionsData.length;
    let NumberOfClasses = classData.length;
    let NumberOfCourses = courseData.length;
    let NumberOfEmployee = employeeData.length;
    

    

    
    const totalReceiptMoney = receiptData.reduce(
      (total, item) => total + item.AmountPaid,
      0
    );

   let incomeData= transectionsData.filter(trans => trans.transectionType == 'income')
   let ExpenseData= transectionsData.filter(trans => trans.transectionType == 'expense')

    const totalincome = incomeData.reduce(
      (total, item) => total + item.amount,
      0
    );
    const totalExpense = ExpenseData.reduce(
      (total, item) => total + item.amount,
      0
    );
    let balance=totalincome-totalExpense


    const totalDue = feeData.reduce(
        (total, item) => total + item.feeBalance,
        0
      );


    const summaryData = {
        NumberOfstudents,
        NumberOfEnrolledStudents,
        NumberOfUsers,
        NumberOfTeachers,
      NumberOfTransections,
      NumberOfClasses,
      NumberOfCourses,
      NumberOfEmployee,

      totalReceiptMoney,
      totalincome,
      totalExpense,
      totalDue,
      balance,
      currentMonthIncome,
      currentMonthExpense
     
    };
    
    res.json(summaryData);
  } catch (error) {
    res.send(error.message);
  }
});
// branchManager report his branch


module.exports = router;
