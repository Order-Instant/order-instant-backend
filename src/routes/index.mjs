import express from 'express';
import getUserData, { signup, login, deleteAccount, changePassword, updateInfo, createUser, forgotPassword } from '../controllers/user.mjs';

const router = express.Router();

router.post('/signup', signup);
router.post('/create-user', createUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/change-password', changePassword);
router.get('/user-data', getUserData);

export default router;
