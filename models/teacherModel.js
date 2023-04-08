const mongoose=require('mongoose');
const Joi=require('joi');

const teacherschema=new mongoose.Schema({
    teacherName:{
        required: true,
        type: String,  
    },
    teacherPhone:{
        type: Number,
        required: true,
    },
    teacherGender:{
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    teacherAddress:{
        type: String,
        required: true,       
    },
    educationalLevel:{
        type: String,
        default: 'bachelor'  
    },
    teacherStatus:{
        type: String,
        required: false,
        default:"Active"
    },
        // userID:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"users",
    //     required: true,
    // },

},{timestamps: true})

function teacherValidation(teacher){
    const teacherVal= Joi.object({
        teacherName:Joi.string().required(),
        teacherPhone:Joi.number().required(),  
        teacherGender:Joi.string().required(),
        educationalLevel:Joi.string().required(),   
        teacherAddress:Joi.string(),    
        teacherStatus:Joi.string(),
        // userID:Joi.string().required(),
        username: Joi.string().required().email({ tlds: { allow: false } }),
        password:Joi.string().required(),   
        
    });
   return teacherVal.validate(teacher);
}
const teacherModel=mongoose.model("teachers",teacherschema);
exports.teacherValidation=teacherValidation;
exports.teacherModel=teacherModel;
