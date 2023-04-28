const mongoose = require("mongoose");
const Joi = require("joi");

const payrollSchema = new mongoose.Schema(
  {
    feeNo: {
        type: Number,
        required: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    feetype: {
        type: String,
        required: true,
    },
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      require: true,
    },  
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    monthly: {
        type: String,
        required: true,
    },
    Year: {
        type: String,
        required: true,
    }, 
  },
  { timestamps: true }
);
function ValidatePayroll(fee) {
  const feeValidate = Joi.object({
    feetype: Joi.string().required(),
    employeeID: Joi.string(),
    employee: Joi.any(),
    userID: Joi.string().required(),
    Year: Joi.string().required(),
    monthly: Joi.string().required(),
    Amount: Joi.number(),
    
  });
  return feeValidate.validate(fee);
}

const payrollModel = mongoose.model("payroll", payrollSchema);

exports.payrollModel = payrollModel;
exports.ValidatePayroll = ValidatePayroll;
