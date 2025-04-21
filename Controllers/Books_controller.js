import { Book_model } from "../Models/Book_model.js";
import { user_model } from "../Models/User_model.js";
export const addbook = async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file); // ✅ Debugging to check image upload
  
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required!", success: false });
      }
  
      const existingBook = await Book_model.findOne({ isbn: req.body.isbn });
      if (existingBook) {
        res.json({ message: "A book with this ISBN already exists!", success: false });
      }
  
      const newBook = new Book_model({
        title: req.body.title,
        image: req.file.path,
        isbn: req.body.isbn,
        category: req.body.category,
        author: req.body.author,
        totalCopies: req.body.totalCopies,
        availableCopies: req.body.totalCopies,
        description: req.body.description,
         // ✅ This will now work if multer is configured properly
      });
  
      await newBook.save();
      console.log("Book added successfully!");
  
      res.json({ message: "Book added successfully", data: newBook, success: true });
    } catch (err) {
      console.error("Error adding book:", err);
      res.json({ message: "Internal server error", error: err.message, success: false });
    }
  };
// export const updateBook = async (req, res)=> {
//         try{
//             const book = await Book_model.findById(req.params.id);
//             if (!book) return res.status(404).json({ message: "book not found"})
//                 book.title = req.body.title || book.title;
//             book.author = req.body.author || book.author;
//             book.category = req.body.category || book.category;
//             book.totalCopies = req.body.totalCopies || book.totalCopies
//             book.availableCopies = req.body.availableCopies || book.availableCopies
//             book.description = req.body.description || book.description
//             const updateBook = await book.save();
//             return res.status(200).json({message: "Book updated successfully",updateBook});
//         } catch(error){
//             return res.status(500).json({message:"an error accurred"})
//         }
//     }




// export const updateBook = async (req, res) => {
//     console.log("enter")
//     try {
//         console.log("call controller page")
//         // Find book by ID
//         const book = await Book_model.findById(req.params.id);
//         if (!book) {
//             return res.json({ message: "Book not found" });
//         }

//         // Update book details
//         book.title = req.body.title || book.title;
//         book.author = req.body.author || book.author;
//         book.category = req.body.category || book.category;
//         book.totalCopies = req.body.totalCopies || book.totalCopies;
//         book.availableCopies = req.body.availableCopies || book.availableCopies;
//         book.description = req.body.description || book.description;
//         book.isbn = req.body.isbn || book.isbn;

//         // Handle Image Upload
//         if (req.file) {
//             // Optional: Delete old image if stored on disk
//             if (book.image) {
//                 const oldImagePath = `uploads/${book.image}`;
//                 if (fs.existsSync(oldImagePath)) {
//                     fs.unlinkSync(oldImagePath);
//                 }
//             }
//             book.image = req.file.filename; // Assuming Multer stores file as `req.file.filename`
//         }

//         // Save updated book
//         const updatedBook = await book.save();
//         console.log("Book updated successfully")

//         return res.json({
//             message: "Book updated successfully",
//             book: updatedBook,
//         });
//     } catch (error) {
//         console.error("Error updating book:", error);
//         return res.json({ message: "An error occurred", error });
//     }
// };

import fs from "fs";
// import Book_model from "../models/Book_model.js"; // Import your book model

export const updateBook = async (req, res) => {
    console.log("Enter updateBook controller");
    console.log(req.body)

    try {
        console.log("Fetching book from database...");
        const book = await Book_model.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update book fields safely
        book.title = req.body.title || book.title;
        console.log("book.title ", book.title )
        book.author = req.body.author || book.author;
        book.category = req.body.category || book.category;
        book.description = req.body.description || book.description;
        book.isbn = req.body.isbn || book.isbn;

        if (typeof req.body.totalCopies !== "undefined") {
            book.totalCopies = req.body.totalCopies;
        }
        if (typeof req.body.availableCopies !== "undefined") {
            book.availableCopies = req.body.availableCopies;
        }

        // Handle Image Upload
        if (req.file) {
            try {
                // Delete old image if it exists
                if (book.image) {
                    const oldImagePath = `uploads/${book.image}`;
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            } catch (err) {
                console.error("Error deleting old image:", err);
            }

            book.image = req.file.filename; // Assuming Multer stores the file as `req.file.filename`
        }

        // Save updated book
        const updatedBook = await book.save();
        console.log("Book updated successfully");

        return res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ message: "An error occurred", error });
    }
};



export const deleteBook = async (req,res) => {
    try{
        const book = await Book_model.findById(req.params.id)
        if (!book) return res.status(404).json({message:"book not found"})
            await book.deleteOne();
        return res.status(200).json({message:"Book deleted successfully!"});
    }catch(error){
        return res.status(500).json({message:"an error occured"});
    }
}
export const getBooks = async (req,res) => {
    try{
        const books = await Book_model.find().populate("category","name");
        res.status(200).json(books)
    }catch(error){
        console.log(error);
        return res.status(500).json({message:" An error occured"})
    }
}
export const getBookById = async (req,res) => {
    try{
        const book = await Book_model.findById(req.params.id).populate("category","name");
        if (!book) return res.status(404).json({message:"Book not found"})
res.status(200).json(book);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:" An error occured"})
    }
}
export const addbookToFavourite = async (req,res) => {
    try {
        const {bookid, id} = req.headers;
        const userData = await user_model.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid)
        console.log(isBookFavourite)
        if (isBookFavourite){
            return res.status(200).json({message: "Book is already in favourites"});
    }
    await user_model.findByIdAndUpdate(id, {$push: {favourites: bookid}})
    return res.status(200).json({message:"Book added to favourites"});
}catch (error){
    res.status(500).json({ message: " internal server error",error})
}
}
export const deletebookToFavourite = async (req,res) => {
    try {
        const {bookid, id} = req.headers;
        const userData = await user_model.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid)
        console.log(isBookFavourite)
        if (isBookFavourite){
            
    
    await user_model.findByIdAndUpdate(id, {$pull: {favourites: bookid}})
        }
    return res.status(200).json({message:"Book deleted to favourites"});
}catch (error){
    res.status(500).json({ message: " internal server error",error})
}
}
export const getAllFavourites = async (req, res) => {
    try {
        const { id } = req.headers; 
        const userData = await user_model.findById(id).populate("favourites"); 

        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const favourites = userData.favourites;

    
        if (favourites.length === 0) {
            return res.status(200).json({ message: "No favourite books found" });
        }

        
        return res.status(200).json({ favourites });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
export const searchbookById = async(req,resp)=>{
    const x= req.params.title
    console.log(x)
    let book =await Book_model.find({title:x})
    console.log(book)
    if (!book){
        return resp.json({msg:"invalid id"})
    }
    resp.json({msg:'your book has been search',book})
}
