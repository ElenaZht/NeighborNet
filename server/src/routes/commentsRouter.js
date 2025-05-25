import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getReportComments, createComment } from '../controllers/commentsController.js';


const router = express.Router();

router.get('/:reportType/:reportId', authenticate, getReportComments)
router.post('/:reportType/:reportId', authenticate, createComment)

export default router;