import express from 'express';
import { signUpUser, deleteAccount } from '../controllers/usersController.js';

const router = express.Router();

router.post('/signup', signUpUser);
router.delete('/:user_id', deleteAccount);

export default router;