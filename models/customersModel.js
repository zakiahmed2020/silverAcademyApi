const mongoose=require('mongoose');
const Joi=require('joi');

const CustomerSchema=new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    phone:{
        type: Number,
        required: true,
    },
  
    code:{
        type: String,
        required: true,
        default: 'mb0001'
    },
    gender:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: false,
        default: 'null'
    },
   
},{timestamps: true})
function vaidateCustomers(customer){
    const custValidate= Joi.object({
        name:Joi.string().min(3).required(),
        phone:Joi.number().min(6).required(),
        gender:Joi.string().required(),     
        code:Joi.string(),   
        address:Joi.string(),     
    });
    return custValidate.validate(customer);
}

const customerModel=mongoose.model("customers",CustomerSchema);


exports.customerModel=customerModel;
exports.vaidateCustomers=vaidateCustomers;