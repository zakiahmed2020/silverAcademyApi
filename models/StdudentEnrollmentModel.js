const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const stdEnrollmentSchema = new mongoose.Schema(
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
    Amount: {
      type: Number,
      required: true,
    },
    enrolledDate: {
      type: Date,
      required: true,
      default: new Date
    },
    enrolledStatus: {
      type: String,
      required: false,
      enum: ["active", "graduated","blocked", "pending", "waiting"],
      default: "active",
    },
  },
  { timestamps: true }
);
function validateEnrollment(classes) {
  const classValidation = Joi.object({
    studentID: Joi.string().required(),
    courseID: Joi.string().required(),
    classID: Joi.string().required(),
    Amount: Joi.number().required(),
    enrolledDate: Joi.date(),
    enrolledStatus: Joi.string(),
    items: Joi.array(),
  });
  return classValidation.validate(classes);
}

const stdEnrollementModel = mongoose.model(
  "studentEnrollment",
  stdEnrollmentSchema
);

exports.stdEnrollementModel = stdEnrollementModel;
exports.validateEnrollment = validateEnrollment;
