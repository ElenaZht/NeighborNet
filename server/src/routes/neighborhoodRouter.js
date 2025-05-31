import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getNeighborhoodById } from '../controllers/neighborhoodController.js';

const router = express.Router();

router.get('/:id', authenticate, getNeighborhoodById)

export default router;