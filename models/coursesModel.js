const mongoose = require("mongoose");
const Joi = require("joi");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
        type: String,
        required: true,
    },
    coursePrice: {
        type: Number,
        required: true,
    },
    courseDuration: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default:'intermediate',
    },
  },
  { timestamps: true }
);
function validateCourse(course) {
  const courseValidate = Joi.object({
    courseName: Joi.string().required(),
    coursePrice: Joi.number().required(),
    courseDuration: Joi.string().required(),
    courseLevel: Joi.string().required(), 
  });
  return courseValidate.validate(course);
}

const courseModel = mongoose.model("courses", courseSchema);

exports.courseModel = courseModel;
exports.validateCourse = validateCourse;
