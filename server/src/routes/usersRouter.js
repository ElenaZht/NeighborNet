import express from 'express';
import { 
    signUpUser, 
    deleteAccount, 
    loginUser,
    logoutUser,
    refreshUserToken,
    editUser
} from '../controllers/usersController.js';
import { authenticate } from '../middleware/auth.js';
import { isAccountOwner } from '../middleware/permissions.js';


const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/refresh-token', refreshUserToken)
router.delete('/:user_id', authenticate, isAccountOwner, deleteAccount);
router.patch('/:user_id', authenticate, isAccountOwner, editUser)

export default router;