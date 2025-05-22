import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addOfferHelp } from '../controllers/offerHelpController.js';


const router = express.Router();

router.post('/', authenticate, addOfferHelp)

export default router;