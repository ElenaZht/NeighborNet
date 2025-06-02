import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addHelpRequest,
    removeHelpReport,
    editHelpRequestReport,
    updateReportStatus
 } from '../controllers/helpRequestController.js'; 


const router = express.Router();

router.post('/', authenticate, addHelpRequest)
router.delete('/:reportId', authenticate, removeHelpReport)
router.patch('/:reportId', authenticate, editHelpRequestReport)
router.patch('/:reportId/status', authenticate, updateReportStatus)

export default router;