import express from 'express';
import { signUpUser, deleteAccount, loginUser } from '../controllers/usersController.js';
import { authenticate } from '../middleware/auth.js';
import { isAccountOwner } from '../middleware/permissions.js';


const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser)
router.delete('/:user_id', authenticate, isAccountOwner, deleteAccount);

export default router;