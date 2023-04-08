const mongoose = require("mongoose");
const Joi = require("joi");

const receiptSchema = new mongoose.Schema(
  {
    feeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fee",
      require: true,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      require: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    receiptNo: {
      type: String,
      default: 0,
    },
    phonePaid: {
      type: Number,
      required: true,
      default: 0,
    },
    phoneReceipt: {
      type: Number,
      required: true,
      default: 0,
    },
    AmountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    receiptStatus: {
      type: String,
      enum: ["receipted", "return"],
      default: "receipted",
    },
    datePaid: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);
function validateReceipt(receipt) {
  const receiptValidate = Joi.object({
    feeID: Joi.string().required(),
    studentID: Joi.string().required(),
    userID: Joi.string(),
    receiptNo: Joi.number(),
    phonePaid: Joi.number().required(),
    phoneReceipt: Joi.number().required(),
    AmountPaid: Joi.number().required(),
    receiptStatus: Joi.string(),
    datePaid: Joi.date(),
    feeStatus: Joi.string(),
  });
  return receiptValidate.validate(receipt);
}

const receiptModel = mongoose.model("receipt", receiptSchema);

exports.receiptModel = receiptModel;
exports.validateReceipt = validateReceipt;
