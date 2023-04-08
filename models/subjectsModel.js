const mongoose = require("mongoose");
const Joi = require("joi");

const validateSchema = new mongoose.Schema(
  {
    subjectName: {
        type: String,
        required: true,
    },
    courseID: {
        type: String,
        required: true,
    },  
  },
  { timestamps: true }
);
function validateSubject(course) {
  const validatesubj = Joi.object({
    subjectName: Joi.string().required(),
    courseID: Joi.string().required(),
  });
  return validatesubj.validate(course);
}

const SubjectModel = mongoose.model("subjects", validateSchema);

exports.SubjectModel = SubjectModel;
exports.validateSubject = validateSubject;
