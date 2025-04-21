import express from 'express'
import { signUp ,signIn, getUser,updateAddress,send_email,changePassword,AllUsers} from '../Controllers/User_controller.js'
import {authenticateToken} from '../middlewares/auth.js';

const router = express.Router();
router.post("/sign-up",signUp);
router.post('/otp',  send_email)
router.post('/change',changePassword)
router.get("/getUser",authenticateToken,getUser);
router.get("/allusers",AllUsers);
// User_router.js
router.post("/sign-In",signIn)
router.put("/update",authenticateToken,updateAddress)
export default router;
