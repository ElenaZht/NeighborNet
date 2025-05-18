import express from 'express';
import { signUpUser, deleteAccount } from '../controllers/usersController.js';
import { authenticate } from '../middleware/auth.js';
import { isAccountOwner } from '../middleware/permissions.js';


const router = express.Router();

router.post('/signup', signUpUser);
router.delete('/:user_id', authenticate, isAccountOwner, deleteAccount);

export default router;