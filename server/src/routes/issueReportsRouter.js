import express from 'express';
import { 
    addIssueReport,
    removeIssueReport,
    editIssueReport,
    getIssueReport
 } from '../controllers/issueReportsController.js';
import { authenticate } from '../middleware/auth.js';


const router = express.Router();

router.post('/', authenticate, addIssueReport)
router.delete('/:reportId', authenticate, removeIssueReport)
router.patch('/:reportId', authenticate, editIssueReport)
router.get('/:reportId', authenticate, getIssueReport)

export default router;