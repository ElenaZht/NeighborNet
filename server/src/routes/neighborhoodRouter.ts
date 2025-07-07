import express from 'express';
import { authenticate } from '../middleware/auth';
import { getNeighborhoodById } from '../controllers/neighborhoodController';

const router = express.Router();

router.get('/:id', authenticate, getNeighborhoodById);

export default router;
