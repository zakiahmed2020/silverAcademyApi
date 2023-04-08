const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const attendenceSchema = new mongoose.Schema(
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
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      require: true,
    },
    day: {
      type: String,
      required: true,
    },
    attended: {
      type: Number,
      required: true,
    },
  
    attendenceStatus: {
      type: String,
      required: true,
      enum: ["present", "upsent", ],
      default: "upsent",
    },
  },
  { timestamps: true }
);
function Validateattendence(classes) {
  const classValidation = Joi.object({
    studentID: Joi.string().required(),
    courseID: Joi.string().required(),
    teacherID: Joi.string().required(),
    classID: Joi.string().required(),
    userID: Joi.string().required(),

    attanded: Joi.number().required(),
    day: Joi.string().required(),
    attendenceStatus: Joi.string(),
  });
  return classValidation.validate(classes);
}

const attendenceModel = mongoose.model(
  "attendence",
  attendenceSchema
);

exports.attendenceModel = attendenceModel;
exports.Validateattendence = Validateattendence;
