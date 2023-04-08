const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const classSchema = new mongoose.Schema(
  {
    className: {
      required: true,
      type: String,
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
    days: [
      {
        label : {type:String, required: true},
        value : {type:String, required: true},
      }
    ],
  
    classShift: {
      required: true,
      type: String,
      enum: ["offline", "online"],
    },
    startedDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },    
    TimeIn: {
      type: String,
      required: true,
    },
    TimeOut: {
      type: String,
      required: true,
    },

    classStatus: {
      type: String,
      required: false,
      default: 'active',
    },
  },
  { timestamps: true }
);
function validateClass(classes) {
  const classValidation = Joi.object({
    className: Joi.string().required(),
    courseID: Joi.string().required(),
    teacherID: Joi.string().required(),
    classShift: Joi.string().required(),
    days: Joi.array().items(),
    startedDate: Joi.date().required(),
    endDate: Joi.string().required(),
    TimeIn: Joi.string().required(),
    TimeOut: Joi.string().required(),
    classStatus: Joi.string(), 
  });
  return classValidation.validate(classes);
}

const classModel = mongoose.model("class", classSchema);

exports.classModel = classModel;
exports.validateClass = validateClass;
