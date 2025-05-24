import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addHelpRequest,
    removeHelpReport,
    editHelpRequestReport
 } from '../controllers/helpRequestController.js'; 


const router = express.Router();

router.post('/', authenticate, addHelpRequest)
router.delete('/:reportId', authenticate, removeHelpReport)
router.patch('/:reportId', authenticate, editHelpRequestReport)

export default router;