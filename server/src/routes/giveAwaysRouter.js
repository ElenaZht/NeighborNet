import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addGiveAwayReport } from '../controllers/giveAwaysController.js';

const router = express.Router();

router.post('/', authenticate, addGiveAwayReport)

export default router;