const mongoose=require('mongoose');
const Joi=require('joi');

const studentSchema=new mongoose.Schema({
    stdID:{
        required: true,
        type: String,  
    },
   studentName:{
        required: true,
        type: String,  
    },
   studentPhone:{
        type: Number,
        required: true,
    },
   studentGender:{
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
   studentAddress:{
        type: String,
        required: true,       
    },
    educationalLevel:{
        type: String,
        default: 'bachelor',  
    },
    studentStatus:{
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

function studentsValidation(student){
    const studentValidation= Joi.object({
        studentName:Joi.string().required(),
        studentPhone:Joi.number().required(),  
        studentGender:Joi.string().required(),
        educationalLevel:Joi.string().required(),   
        studentAddress:Joi.string(),    
        studentStatus:Joi.string(),
        username:Joi.string().required(),   
        password:Joi.string().required(),   
        // userID:Joi.string().required(),
        
    });
   return studentValidation.validate(student);
}
const studentModel=mongoose.model("student",studentSchema);
exports.studentsValidation=studentsValidation;
exports.studentModel=studentModel;
