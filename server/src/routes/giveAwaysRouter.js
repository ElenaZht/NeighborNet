import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addGiveAwayReport,
    removeGiveAwayReport
 } from '../controllers/giveAwaysController.js';

const router = express.Router();

router.post('/', authenticate, addGiveAwayReport)
router.delete('/:reportId', authenticate, removeGiveAwayReport)


export default router;