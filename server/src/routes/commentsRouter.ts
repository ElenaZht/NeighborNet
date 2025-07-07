import express from 'express';
import { authenticate } from '../middleware/auth';
import { getReportComments, createComment } from '../controllers/commentsController';

const router = express.Router();

router.get('/:reportType/:reportId', authenticate, getReportComments);
router.post('/:reportType/:reportId', authenticate, createComment);

export default router;
