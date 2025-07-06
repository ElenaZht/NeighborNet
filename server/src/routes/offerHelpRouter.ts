import express from 'express';
import { authenticate } from '../middleware/auth';
import { 
    addOfferHelp,
    removeOfferHelpReport,
    editOfferHelpReport,
    updateReportStatus
 } from '../controllers/offerHelpController';

const router = express.Router();

router.post('/', authenticate, addOfferHelp);
router.delete('/:reportId', authenticate, removeOfferHelpReport);
router.patch('/:reportId', authenticate, editOfferHelpReport);
router.patch('/:reportId/status', authenticate, updateReportStatus);

export default router;
