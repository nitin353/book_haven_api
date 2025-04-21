import express from "express"
import {borrowBook, returnBook,getBorrowedBooks, getAllTransactions,approveTransaction } from "../Controllers/Transaction_controller.js"
import {authenticateToken,isLibrarian} from "../middlewares/auth.js"
const router = express.Router();

router.post("/borrow",authenticateToken,borrowBook)
router.put("/return/:id",authenticateToken,returnBook )
router.get("/borrowed/:userId", getBorrowedBooks);
router.get("/transactions", getAllTransactions)
router.put("/approved/:id",authenticateToken,isLibrarian, approveTransaction )
export default router;