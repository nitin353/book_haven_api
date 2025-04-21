import mongoose from "mongoose";
const otpSchema=new mongoose.Schema({
    email:{type:String},
    code:{type:String},
    expireIn:{type:Number}
},
{
    timestamps:true
}
)
export const Otp_model=mongoose.model('otp',otpSchema)