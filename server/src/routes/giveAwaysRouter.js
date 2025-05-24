import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
    addGiveAwayReport,
    removeGiveAwayReport,
    editGiveAwayReport
 } from '../controllers/giveAwaysController.js';

const router = express.Router();

router.post('/', authenticate, addGiveAwayReport)
router.delete('/:reportId', authenticate, removeGiveAwayReport)
router.patch('/:reportId', authenticate, editGiveAwayReport)


export default router;