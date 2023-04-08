const mongoose = require("mongoose");
const Joi = require("joi");

const feeSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      require: true,
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      require: true,
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      require: true,
    },
    feeNo: {
        type: String,
        required: true,
    },
    feeName: {
        type: String,
        required: true,
    },
    feetype: {
        type: String,
        required: true,
    },
    feeAmount: {
        type: Number,
        required: true,
    },
    feePaid: {
        type: Number,
        required: true,
        default: 0,
    },
    feeBalance: {
        type: Number,
        default: 0,
    },
    feeStatus: {
        type: String,
        enum: ['percialPaid','fullPaid','unpaid'],
        default:'unpaid',
    },
  },
  { timestamps: true }
);
function validateFee(fee) {
  const feeValidate = Joi.object({
    studentID: Joi.string(),
    courseID: Joi.string(),
    classID: Joi.string(),
    feeName: Joi.string().required(),
    feeNo: Joi.string(),
    feetype: Joi.string().required(),
    
    feeAmount: Joi.number(),
    feePaid: Joi.number(),
    feeBalance: Joi.number(),
    feeStatus: Joi.string(), 
  });
  return feeValidate.validate(fee);
}

const feeModel = mongoose.model("fee", feeSchema);

exports.feeModel = feeModel;
exports.validateFee = validateFee;
