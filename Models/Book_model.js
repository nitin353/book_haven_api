import mongoose from "mongoose";
const book = new mongoose.Schema({
    title:{type:String,required:true},
    image:{type:String},
    author:{type:String,required:true},
    isbn:{type:String ,unique: true,required:true},
    category:{type:String,required:true},
    totalCopies:{type:Number,required:true},
    availableCopies:{type:Number,require:true},
    description:{type:String},
},
{timestamps:true}
)
export const Book_model = mongoose.model("books",book)