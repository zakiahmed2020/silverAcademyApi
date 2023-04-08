const mongoose = require("mongoose");
const Joi = require("joi");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
        type: String,
        required: true,
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
    servicePrice: {
        type: Number,
        required: true,
    },
    AmountPaid: {
        type: Number,
        required: true,
        default: 0,
    },
    Balance: {
        type: Number,
        default: 0,
    },
    Status: {
        type: String,
        enum: ['percialPaid','fullPaid','unpaid'],
        default:'unpaid',
    },
  },
  { timestamps: true }
);
function validateService(course) {
  const Servicevalidate = Joi.object({
    serviceName: Joi.string().required(),
    customerID: Joi.string().required(),
    servicePrice: Joi.number().required(),
    userID: Joi.string().required(),
    AmountPaid: Joi.number(), 
    Balance: Joi.number(), 
    Status: Joi.string(), 
  });
  return Servicevalidate.validate(course);
}

const serviceModel = mongoose.model("services", serviceSchema);

exports.serviceModel = serviceModel;
exports.validateService = validateService;
