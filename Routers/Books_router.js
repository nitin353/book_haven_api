import express from 'express'
import { addbook,updateBook,deleteBook,getBooks,  getBookById,searchbookById} from '../Controllers/Books_controller.js'
import {authenticateToken,  isLibrarian } from '../middlewares/auth.js';
import multer from "multer"
import fs from "fs"
const router = express.Router();
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// router.post("/addbook",upload.single("Image"),authenticateToken, isLibrarian ,addbook);
router.post("/addbook",upload.single("image"),authenticateToken,isLibrarian,addbook);
router.put("/updateBook/:id",authenticateToken ,isLibrarian,updateBook);
router.delete("/deletebook/:id",authenticateToken ,isLibrarian,deleteBook);

router.get('/title', searchbookById )
router.get("/showbooks" ,getBooks);
router.get("/getbookbyid/:id" ,  getBookById);
export default router;