const Joi=require('joi');
const express=require('express');
const mongoose=require('mongoose');

const roleSchema=new mongoose.Schema({ 
    permissions:{
        type:Array,
    },
   role:{
    type: String,
   },
},{timestamps: true});

function validateRoles(user){
    const userValidation= Joi.object({
        permissions:Joi.any(),
        role:Joi.string().required(),   
    });
    return userValidation.validate(user);
}

const roleModel = mongoose.model('roles',roleSchema)
exports.roleModel = roleModel;
exports.validateRoles = validateRoles;