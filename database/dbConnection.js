import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:'Hospital_management',
    }).then(()=>{
        console.log("DB Connected")
    }).catch(err=>{
        console.log(`Error in Connecting DB:${err}`)
    })
}