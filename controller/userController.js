import { catchAsyncError } from "../middlewares/catchasyncerror.js";
import ErrorHandler from '../middlewares/errorMidleware.js'
import { Users } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from 'cloudinary'

export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const {firstName,lastName,email,phone,age,gender,password,role}=req.body
    if(!firstName||!email||!phone||!age||!gender||!password){
        return next(new ErrorHandler("Please Fill full form",400))
    }
    let user=await Users.findOne({email})
    if (user){
        return next(new ErrorHandler("User already Exist",400))
    }
    user=await Users.create({
        firstName,lastName,email,phone,age,gender,password,role
    })
    generateToken(user,"User Registered",200,res)
})

export const login=catchAsyncError(async(req,res,next)=>{
    const{email,password,confirmPassword,role}=req.body
    if(!email||!password||!confirmPassword||!role){
        return next(new ErrorHandler("Provide proper Details",400))
    }
    if(password!==confirmPassword){
        return next(new ErrorHandler("Password Does not match",400))
    }
    const user=await Users.findOne({email}).select("+password")
    if(!user){
        return next( new ErrorHandler("Invalid Password or Email",400))
    }
    const isPasswordMatched=await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password",400))
    }
    if(role!==user.role){
        return next(new ErrorHandler("User with this role not found",400))
    }
    generateToken(user,"User Login Sucess",200,res)
})

export const addAdmin=catchAsyncError(async(req,res,next)=>{
    const {firstName,lastName,email,phone,age,gender,password}=req.body
    if(!firstName||!email||!phone||!age||!gender||!password){
        return next(new ErrorHandler("Please Fill full form",400))
    }
    const isRegistered=await Users.findOne({email})
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already Exists`,400))
    }

    const admin=await Users.create({firstName,lastName,email,phone,age,gender,password,role:"Admin"})
})

export const getDoctors= catchAsyncError(async(req,res,next)=>{
    const doctors=await Users.find({role:"Doctor"})
        res.status(200).json({
            success:true,
            doctors
    })
})

export const userDetails=catchAsyncError(async(req,res,next)=>{
    const user=req.user
    res.status(200).json({
        success:true,
        user
    })
})

export const logoutAdmin=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie('adminToken',"",{
        httpOnly:true,
        secure:true,
        sameSite:"None",
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"Admin Logout Successfully"
    })
})

export const logoutPatient=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        secure:true,
        sameSite:"None",
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"Patient Logout Successfully"
    })
})

export const addDoctor=catchAsyncError(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Doctor Avatar required",400))
    }
    const {docAvatar}=req.files
    const allowedFormats=["image/png","image/jpg","image/jpeg"]
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format not Supported",400))
    }
    const {
        firstName,lastName,email,phone,age,gender,password,doctorDepartment
    }=req.body
    if(!firstName||!email||!phone||!age||!gender||!password||!doctorDepartment){
        return next(new ErrorHandler("Fill full form",400))
    }
    const isRegistered=await Users.findOne({email})
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} is already Registered`,400)
        )}
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath)
    if(!cloudinaryResponse ||  cloudinaryResponse.error){
        console.error("Unknown Error")
    }
    const doctor=await Users.create({
        firstName,lastName,email,phone,age,gender,password,doctorDepartment,role:"Doctor",docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    })
    res.status(200).json({
        success:true,
        message:"Doctor Registered",
        doctor
    })
})