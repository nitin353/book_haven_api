import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    book:{type: mongoose.Schema.Types.ObjectId, ref: "book", required: true},
    issueDate:{type:Date, default:Date.now},
    dueDate: { type: Date, },
    returnDate: {type:Date},
    status: {type: String, enum: ["borrowed","returned"], default:"borrowed"},
    fine: { type: Number, default: 0 },
    Librarian_ap: {type: String, enum: ["approved","pending"], default:"pending"},


},{timestamps: true});


export const TransactionModel = mongoose.model("Transactions",transactionSchema);