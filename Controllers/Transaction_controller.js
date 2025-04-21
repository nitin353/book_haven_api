import { TransactionModel } from "../Models/TransactionModel.js";
import { Book_model } from "../Models/Book_model.js";
import { user_model } from "../Models/User_model.js";
import mongoose from "mongoose";
export const borrowBook = async (req, res) => {
    const { bookId, userId, dueDate } = req.body;
  
    try {
      // 1. Check if book exists
      const book = await Book_model.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });
  
      // 2. Check if any copies are available
      if (book.availableCopies <= 0) {
        return res.status(400).json({ message: "No copies available" });
      }
  
      // 3. Check how many books the user has already borrowed (not returned)
      const userBorrowedBooks = await TransactionModel.countDocuments({
        user: userId,
        status: "borrowed"
      });
  
      if (userBorrowedBooks >= 5) {
        return res.status(400).json({ message: "Limit reached. You can borrow up to 5 books." });
      }
  
      // 4. Check if user has already borrowed this same book
      const alreadyBorrowed = await TransactionModel.findOne({
        user: userId,
        book: bookId,
        status: "borrowed"
      });
  
      if (alreadyBorrowed) {
        return res.status(400).json({ message: "You have already borrowed this book." });
      }
  
      // 5. Create transaction
      const newTransaction = await TransactionModel.create({
        user: userId,
        book: bookId,
        dueDate: dueDate,
        status: "borrowed"
      });
  
      // 6. Update book's available copies
      book.availableCopies -= 1;
      await book.save();
  
      res.status(201).json({
        message: "Book borrowed successfully",
        transaction: newTransaction
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const returnBook = async (req, res) => {
    try {
        const transaction = await TransactionModel.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (transaction.status === "returned") {
            return res.status(400).json({ message: "Book already returned" });
        }

        // ✅ Book return update
        transaction.status = "returned";
        transaction.returnDate = new Date();

        // ✅ Fine calculation
        if (transaction.dueDate) {
            let daysLate = Math.max(0, Math.ceil((transaction.returnDate - transaction.issueDate) / (1000 * 60 * 60 * 24)) - 15);
            transaction.fine = daysLate > 0 ? daysLate * 10 : 0; // ₹10 per extra day
        }

        await transaction.save();

        // ✅ Book availability update
        const book = await Book_model.findById(transaction.book._id);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.json({
            message: "Book returned successfully",
            transaction,
            fine: transaction.fine // ✅ Fine bhi response me bhejna
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getBorrowedBooks = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Fetch Borrowed Books for the User
        let borrowedBooks = await TransactionModel.find({ user: new mongoose.Types.ObjectId(userId), status: "borrowed" });

        if (borrowedBooks.length === 0) {
            return res.status(404).json({ message: "No borrowed books found for this user" });
        }

        // Step 2: Update Fine for Overdue Books
        const today = new Date();

        for (let transaction of borrowedBooks) {
            const issueDate = new Date(transaction.issueDate);
            const fineStartDate = new Date(issueDate);
            fineStartDate.setDate(fineStartDate.getDate() + 15); // Fine starts after 15 days

            if (today > fineStartDate) {
                const overdueDays = Math.ceil((today - fineStartDate) / (1000 * 60 * 60 * 24)); // Calculate overdue days
                transaction.fine = overdueDays * 10; // ₹10 per day fine
                await transaction.save();
            }
        }

        // Step 3: Fetch Updated Data Again
        borrowedBooks = await TransactionModel.find({ user: new mongoose.Types.ObjectId(userId), status: "borrowed" });

        res.status(200).json(borrowedBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    export const getAllTransactions = async (req, res) => {
        try {
            const transactions = await TransactionModel.find()
         
    
            if (transactions.length === 0) {
                return res.status(404).json({ message: "No transactions found" });
            }
    
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    

export const approveTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            id,
            {  Librarian_ap: "approved" },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction approved", transaction: updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error approving transaction", error });
    }
};