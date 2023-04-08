const mongoose = require("mongoose");
const Joi = require("joi");

const marksSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      require: true,
    },   
    subjectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
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
    Total: {
      type: Number,
      required: false,
      default:100
    },
    
  },
  { timestamps: true }
);
function validateMarks(classes) {
  const marksVal = Joi.object({
    studentID: Joi.string().required(),
    classID: Joi.string().required(),
    subjectID: Joi.string().required(),
    Amount: Joi.number().required(),
  });
  return marksVal.validate(classes);
}

const marksModel = mongoose.model("marks",marksSchema);

exports.marksModel = marksModel;
exports.validateMarks = validateMarks;
