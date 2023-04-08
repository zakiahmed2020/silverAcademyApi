const mongoose=require('mongoose');
const jwt=require("jsonwebtoken");
const Joi=require('joi');

const UserSchema=new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    phone:{
        required: true,
        type: Number
    },
    teacherID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"teachers",
        default:null
    },
    studentID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student",
        default:null
    },
    username:{
        required: true,
        type: String
    },
    password:{
        type: String,
        required: true,
    },
    // permissions:{
    //     type:Array,
    //     default:[]
    // },
   userType:{
    type: String,
    required:true
   },
   status:{
        type: Boolean,
        required: false,
        default:true
    },
    DeleteStatus:{
        type: Boolean,
        required: false,
        default:false
    },
    // userImage:{
    //     data: Buffer,
    //     contentType: String
    //     required: true,
    //     default:false
    // },
    // userImageImageType: {
    //     type: String,
    //     required: true
    //   },
   
},{timestamps: true})
function validateUsers(user){
    const userValidation= Joi.object({       
        name:Joi.string().required(),
        phone:Joi.number().required(),
        username: Joi.string().required().email({ tlds: { allow: false } }),
        password:Joi.string().required(),
        // userImage:Joi.any(), 
        userType:Joi.string().required(), 
        teacherID:Joi.string(), 
        // permissions:Joi.any(),
    
    });
    return userValidation.validate(user);
}

    const UserModel=mongoose.model("users",UserSchema);


exports.UserModel=UserModel;
exports.validateUsers=validateUsers;