import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addOfferHelp,
    removeOfferHelpReport
 } from '../controllers/offerHelpController.js';


const router = express.Router();

router.post('/', authenticate, addOfferHelp)
router.delete('/:reportId', authenticate, removeOfferHelpReport)

export default router;