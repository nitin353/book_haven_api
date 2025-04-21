import express from 'express'
import { contact } from '../Controllers/Contact_controller.js';
const router = express.Router();


router.post('/conn',  contact)

export default router;