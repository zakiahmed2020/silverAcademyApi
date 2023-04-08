const mongoose=require('mongoose');
const Joi=require('joi');

// const {UserseModel}=require('./userModel');
const transectionsSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    transectionType:{
        required: true,
        type: String,
        enum:["expense","income"]     
    },
    receiptID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"receipt",
        default:null
    },
    ServiceReceiptID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"serviceReceipt",
        default:null
    },
 
    type:{
        type: String,
        required: false,
        default:0
    },
    transectionNo:{
        type: Number,
        required: false,
        default:0
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now, 
    }

   
},{timestamps: true})

function validateTransections(user){
    const userValidation= Joi.object({
        userID:Joi.string().required(),
        receiptID:Joi.string(),
        transectionType:Joi.string().required(),
        type:Joi.string().required(),
        name:Joi.string().required(),
        transectionNo:Joi.string(),
        description:Joi.string().required(),
        amount:Joi.number().required(),  
        date:Joi.date()
    });
    return userValidation.validate(user);
}
const transModel=mongoose.model("transection",transectionsSchema);
exports.validateTransections=validateTransections;
exports.transModel=transModel;
