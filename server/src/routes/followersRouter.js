import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addFollower, removeFollower } from '../controllers/followersController.js';


const router = express.Router();

router.post('/:reportType/:reportId', authenticate, addFollower);
router.delete('/:reportType/:reportId', authenticate, removeFollower);

export default router;