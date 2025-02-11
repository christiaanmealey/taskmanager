import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, userController.fetchUsers);
router.get('/s/', protect, userController.fetchUserByEmail);
router.get('/:id', protect, userController.fetchUserById);

router.post('/login', userController.authUser);
router.post('/register', userController.registerUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

//create a middleware to hash passwords immediately being passed to controller
export default router;