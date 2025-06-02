import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addGiveAwayReport,
    removeGiveAwayReport,
    editGiveAwayReport,
    getGiveAwayReport,
    updateReportStatus
 } from '../controllers/giveAwaysController.js';

 
const router = express.Router();

router.post('/', authenticate, addGiveAwayReport)
router.delete('/:reportId', authenticate, removeGiveAwayReport)
router.patch('/:reportId', authenticate, editGiveAwayReport)
router.get('/:reportId', authenticate, getGiveAwayReport)
router.patch('/:reportId/status', authenticate, updateReportStatus)


export default router;
