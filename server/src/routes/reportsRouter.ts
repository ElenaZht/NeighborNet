import express from 'express';
import { getAllReports } from '../controllers/reportsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, getAllReports);

export default router;
