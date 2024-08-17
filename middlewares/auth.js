import { catchAsyncError } from "./catchasyncerror.js";
import jwt from 'jsonwebtoken'
import ErrorHandler from "./errorMidleware.js";
import { Users } from "../models/userSchema.js";

export const isAdmin=catchAsyncError(async(req,res,next)=>{
    const token=req.cookies.adminToken
    if(!token){
        return next(new ErrorHandler("Admin not authenticated",400))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=await Users.findById(decoded.id)
    if(req.user.role!=='Admin'){
        return next(new ErrorHandler(`${req.user.role} is not authorized`,403))
    }next()
})

export const isPatient=catchAsyncError(async(req,res,next)=>{
    const token=req.cookies.patientToken
    if(!token){
        return next(new ErrorHandler("Patient not authenticated",400))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=await Users.findById(decoded.id)
    if(req.user.role!=='Patient'){
        return next(new ErrorHandler(`${req.user.role} is not authorized`,403))
    }next()
})