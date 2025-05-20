import express from 'express';
import getUserData, { signup, login, deleteAccount, changePassword, createUser, forgotPassword, updateUserInfo, accountDeleteRequest } from '../controllers/user.mjs';

const router = express.Router();

router.post('/signup', signup);
router.post('/create-user', createUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/change-password', changePassword);
router.get('/user-data', getUserData);
router.put('/update-user-info', updateUserInfo);
router.post('/account-delete-request', accountDeleteRequest);
router.delete('/account-delete', deleteAccount);

export default router;
