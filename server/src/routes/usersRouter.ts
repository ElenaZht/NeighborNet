import express from 'express';
import { 
    signUpUser, 
    deleteAccount, 
    loginUser,
    logoutUser,
    refreshUserToken,
    editUser
} from '../controllers/usersController';
import { authenticate } from '../middleware/auth';
import { isAccountOwner } from '../middleware/permissions';

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh-token', refreshUserToken);
router.delete('/:user_id', authenticate, isAccountOwner, deleteAccount);
router.patch('/:user_id', authenticate, isAccountOwner, editUser);

export default router;
