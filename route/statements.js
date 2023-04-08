const express = require("express");
const router = express.Router();
const {transModel} = require("../models/TransectionModel");

// get user transection by populating user and it transections
// router.get("/", async function (req, res) {
//     const userID = req.params.id;
//     let data;
//     try {
//       data = await transModel.find().populate({
//         path: "userID",
//         model: "users",
//         select: "-_id name ",
//       });
//       let bal = 0;
//       data = data.map((item) => {
//         let obj = JSON.parse(JSON.stringify(item));
//        obj.transectionType == "income" ? (bal += obj.amount) : (bal -= obj.amount);
//        obj.runBalance =bal;
//         let newObject = {...obj, ...obj.userID };
//         delete newObject.userID;
//         return newObject;
//       });
    
//       // console.log("from data" + data);
      
//       res.json({info:data});
//       // res.send(info);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ success: false, msg: err });
//     }
//   });
router.get("/latest", async function (req, res) {
    const userID = req.params.id;
    let data;
    try {
      data = await transModel.find().populate({
        path: "userID",
        model: "users",
        select: "-_id name ",
      }).sort({createdAt: -1}).limit(6);
      
      
      res.json(data);
      // res.send(info);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  });

module.exports = router;
