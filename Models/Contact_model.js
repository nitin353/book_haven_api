import mongoose from "mongoose";
const contactSchema = mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:Number,require:true},
    message:{type:String,require:true},
    
})

export const Contact_model =mongoose.model("contact",contactSchema)