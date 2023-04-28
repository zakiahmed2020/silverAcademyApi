const mongoose=require('mongoose');
const Joi=require('joi');

const employeeSchema=new mongoose.Schema({
    name:{
        required: true,
        type: String,  
    },
    phone:{
        type: Number,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    address:{
        type: String,
        required: true,       
    },
    educationalLevel:{
        type: String,
        default: 'primary'  
    },
    jobTitle:{
        type: String,
        required: true,       
    },
    departmentWork:{
        type: String,
        required: true,       
    },
    bloodType:{
        type: String,
        required: true,       
    },
    typeOfworking:{
        type: String,
        required: false, 
        default: 'permanent'  
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    dateOfBirth:{
        type: Date,
        required: true,
    },
    salaryAmount:{
        type: Number,
        required: true,
    },
    employeeStatus:{
        type: String,
        required: false,
        default:"Active"
    },
    DeleteStatus:{
        type: Boolean,
        required: false,
        default:false
    },
   
},{timestamps: true})

function employeeValidation(hospital){
    const cardValidation= Joi.object({
        name:Joi.string().required(),
        phone:Joi.number().required(),  
        gender:Joi.string().required(),
        address:Joi.string().required(),
        educationalLevel:Joi.string(),
        departmentWork:Joi.string(),
        jobTitle:Joi.string().required(),
        bloodType:Joi.string().required(),
        salaryAmount:Joi.number().required(),  
        typeOfworking:Joi.string(),
        employeeStatus:Joi.string(),
        userID:Joi.string().required(),
        dateOfBirth:Joi.date().required()
    });
   return cardValidation.validate(hospital);
}
const employeeModel=mongoose.model("employee",employeeSchema);
exports.employeeValidation=employeeValidation;
exports.employeeModel=employeeModel;
