import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addHelpRequest } from '../controllers/helpRequestController.js'; 


const router = express.Router();

router.post('/', authenticate, addHelpRequest)

export default router;