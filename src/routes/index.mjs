import express from 'express';
import { signup, login, deleteAccount, changePassword, updateInfo, createUser } from '../controllers/user.mjs';

const router = express.Router();

router.post('/signup', signup);
router.post('/create-user', createUser);
router.post('/login', login);
router.delete('/delete-account/:userId', deleteAccount);
router.put('/change-password/:userId', changePassword);
router.put('/update-info/:userId', updateInfo);

export default router;
