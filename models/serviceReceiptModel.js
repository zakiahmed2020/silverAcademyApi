const mongoose = require("mongoose");
const Joi = require("joi");

const serviceReceiptSchema = new mongoose.Schema(
  {
    serviceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      require: true,
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      require: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    receiptNo: {
      type: Number,
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
   
    datePaid: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);
function validateServiceReceipt(receipt) {
  const receiptValidate = Joi.object({
    serviceID: Joi.string().required(),
    customerID: Joi.string().required(),
    userID: Joi.string().required(),
    receiptNo: Joi.number(),
    phonePaid: Joi.number().required(),
    phoneReceipt: Joi.number().required(),
    AmountPaid: Joi.number().required(),
    datePaid: Joi.date(),
  });
  return receiptValidate.validate(receipt);
}

const serviceReceiptModel = mongoose.model("serviceReceipt", serviceReceiptSchema);

exports.serviceReceiptModel = serviceReceiptModel;
exports.validateServiceReceipt = validateServiceReceipt;
