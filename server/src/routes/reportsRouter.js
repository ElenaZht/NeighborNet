import express from 'express';
import { getAllReports } from '../controllers/reportsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, getAllReports);

export default router;