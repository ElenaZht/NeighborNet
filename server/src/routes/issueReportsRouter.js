import express from 'express';
import { addIssueReport } from '../controllers/issueReportsController.js';
import { authenticate } from '../middleware/auth.js';


const router = express.Router();

router.post('/', authenticate, addIssueReport)

export default router;