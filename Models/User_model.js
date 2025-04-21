import mongoose from "mongoose";
const user = new mongoose.Schema({
    name:{ type: String, require: true, unique:true},
    email: {type: String, require: true, unique:true},
    stream: {type: String, require: true, unique:true},
    password: {type: String, require: true},
    role:{type:String, default:"student",enum:["student","teacher","librarian"]},
    borrowedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Transaction"}]

},
{timestamps: true}
)
export const user_model =mongoose.model("users",user)