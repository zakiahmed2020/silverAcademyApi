const express=require('express');
const mongoose=require('mongoose');
const Joi=require('joi');
const subscriptionShema= new mongoose.Schema({
     subscriptoinTerm:{
        type: String,
        required: true,
        enum: ['OneMonth','ThreeMonth','SixMonth','TwelveMonth']  
    },
     accountType:{
        type: String,
        required: true,
    },
    amountPaid:{
        type: Number,
        required: true,
    },
    PhonePaid:{
        type: Number,
        required: true,
    },
    datePaid:{
        type:Date,
        default: Date.now,
    },
    expiredDate:{
        type:Date,
       required: true
    },
   
},{timestamps:true});

function validateSubscriptions(subs){
    const subsVaidate=Joi.object({    
       
        subscriptoinTerm:Joi.string().required(),
        amountPaid:Joi.number().required(),
        PhonePaid:Joi.number().required(),
        accountType:Joi.string().required(),
        datePaid:Joi.date().required(),
        expiredDate:Joi.date().required(),
        
    })
    return subsVaidate.validate(subs)
}
const subscriptionModel = mongoose.model('subscription',subscriptionShema);
exports.subscriptionModel=subscriptionModel;
exports.validateSubscriptions=validateSubscriptions;