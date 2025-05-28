import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addOfferHelp,
    removeOfferHelpReport,
    editOfferHelpReport,
    getOfferHelpRequest,
    updateReportStatus
 } from '../controllers/offerHelpController.js';


const router = express.Router();

router.post('/', authenticate, addOfferHelp)
router.delete('/:reportId', authenticate, removeOfferHelpReport)
router.patch('/:reportId', authenticate, editOfferHelpReport)
router.get('/:reportId', authenticate, getOfferHelpRequest)
router.patch('/:reportId/status', authenticate, updateReportStatus)

export default router;
