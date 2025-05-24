import express from 'express';
import getUserData, { signup, login, deleteAccount, changePassword, createUser, forgotPassword, updateUserInfo, accountDeleteRequest } from '../controllers/user.mjs';
import { addPackage, deletePackage, getAllPackages, getPackage, getPackages, updatePackage } from '../controllers/package.mjs';

const router = express.Router();

// Routes for user
router.post('/signup', signup);
router.post('/create-user', createUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/change-password', changePassword);
router.get('/user-data', getUserData);
router.put('/update-user-info', updateUserInfo);
router.post('/account-delete-request', accountDeleteRequest);
router.delete('/account-delete', deleteAccount);

// Routes for package
router.get('/get-package/:packageId', getPackage);
router.get('/user-packages', getPackages);
router.post('/add-package', addPackage);
router.get('/get-all-packages', getAllPackages);
router.put('/update-package/:packageId', updatePackage);
router.delete('/delete-package/:packageId', deletePackage);

export default router;
