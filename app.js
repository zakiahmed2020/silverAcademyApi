var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose");

const login=require('./route/login');
const Employee=require('./route/employee')
const users=require('./route/users');
const roles=require('./route/roles');
const classes=require('./route/classRoute');
const courses=require('./route/coursesRoute');
const teacher=require('./route/teacherRoute');
const student=require('./route/studentRoute');
const studentEnrollment=require('./route/stdEnrolllmentRoute');
const fee=require('./route/feeRoute');
const receipt=require('./route/receiptRoute');
const Transections=require('./route/transectionRoute');
const Attendence=require('./route/attendenceRoute');
const dashboardSummary=require('./route/dashboardSummary');
const Statements=require('./route/statements');
const subscription=require('./route/subscriptionRoute');
const Customers=require('./route/customersRoute');
const Service=require('./route/serviceRoute');
const ServiceReceipt =require('./route/serviceReceiptRoute')
const subjectRoute =require('./route/subjectRoute')
const MarksRoute =require('./route/marksRoute')
const loginPortal =require('./route/portalLoginRoute')
const Auth =require('./middleware/auth')

var app = express();

// view engine setup


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json());

app.use('/login',login);
app.use('/loginportal',loginPortal);
app.use(Auth)
// routes
app.use('/courses',courses);
app.use('/class',classes);
app.use('/teacher',teacher);
app.use('/student',student);
app.use('/Enrollment',studentEnrollment);
app.use('/fee',fee);
app.use('/receipt',receipt);
app.use('/transection',Transections);
app.use('/attendence',Attendence);
app.use('/statement',Statements);
app.use('/summary',dashboardSummary);
app.use('/subscription',subscription);
app.use('/customers',Customers);
app.use('/service',Service);
app.use('/serviceReceipt',ServiceReceipt);
app.use('/subject',subjectRoute);
app.use('/marks',MarksRoute);

app.use('/employee',Employee);
app.use('/users',users);
app.use('/roles',roles);




 mongoose.connect("mongodb+srv://zaki:q3JoD0jh0w1gWi3y@cluster0.zomh4.mongodb.net/silveracademyDB").
 then(()=>console.log("Connected successfully mangodb"))
 .catch(err=>console.log("not connected mongodb",err));

module.exports = app;
