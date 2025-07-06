import express from 'express';
import { 
    addIssueReport,
    removeIssueReport,
    editIssueReport,
    updateReportStatus
 } from '../controllers/issueReportsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, addIssueReport);
router.delete('/:reportId', authenticate, removeIssueReport);
router.patch('/:reportId', authenticate, editIssueReport);
router.patch('/:reportId/status', authenticate, updateReportStatus);

export default router;
