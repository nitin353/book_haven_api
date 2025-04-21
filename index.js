import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User_router from './Routers/User_router.js';
import Books_router from './Routers/Books_router.js';
import cors from 'cors';
import Contact_router from './Routers/Contact_router.js'
import Transaction_router from './Routers/Transaction_router.js'
import cron from "node-cron"
import { TransactionModel } from './Models/TransactionModel.js';
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use("/uploads",express.static("uploads"));
// Load environment variables
dotenv.config();

// Get the port and MongoDB URL from the environment variables
const PORT = process.env.PORT;
const db_URL = process.env.MONGO_URL;

// Connect to MongoDB
//mongoose.connect(db_URL)
 // .then(() => {
 //   console.log("Mongo_db successfully connected".green);
//  })
 // .catch((err) => {
   // console.log("Database connectivity error".red);
 // });
 mongoose.connect(db_URL,{dbName:"bookstore"}).then(()=>{
  console.log(colors.bgGreen("mongodb connected successfully"))
  
}).catch((err)=>{
  console.log(colors.bgBlue("mongodn connectivity error",err))
})

// CORS setup - allow requests from the frontend with credentials
app.use(cors({
    origin: true, // Frontend URL
    // origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow credentials (cookies, HTTP auth, etc.)
}));

// Set up routes
app.use("/api/books", Books_router);
app.use("/api/users", User_router);
app.use('/api/contact',Contact_router)
app.use("/api/transaction",Transaction_router)
cron.schedule("0 0 * * *", async () => {
  try {
      const today = new Date();
      console.log("Running daily fine update job...");

      // Find all transactions where book is still borrowed
      const transactions = await TransactionModel.find({ status: "borrowed" });

      for (let transaction of transactions) {
          const issueDate = new Date(transaction.issueDate);
          const fineStartDate = new Date(issueDate);
          fineStartDate.setDate(fineStartDate.getDate() + 15); // Fine starts after 15 days

          // Fine should only apply if today's date is past fine start date
          if (today > fineStartDate) {
              const overdueDays = Math.ceil((today - fineStartDate) / (1000 * 60 * 60 * 24)); // Calculate days overdue
              transaction.fine = overdueDays * 10; // ₹10 per day fine
              await transaction.save();
          }
      }

      console.log("Fine updated successfully for overdue books.");
  } catch (error) {
      console.error("Error updating fines:", error);
  }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Welcome to the server at: ${PORT}`.blue);
});
