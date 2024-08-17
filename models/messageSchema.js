import mongoose from "mongoose";
import validator from "validator";

const messageSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name must contain 3 Letters"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Please Provide a Valid Email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Not a Valid Phone Number"],
        maxLength:[13,"Not a Valid Phone Number"],
    },
    message:{
        type:String,
        required:true,
        minLength:[4,"Min 4 Characters"],
        maxLength:[40,"Max 40 Characters"]
    }
})

export const Message=mongoose.model("Message",messageSchema)