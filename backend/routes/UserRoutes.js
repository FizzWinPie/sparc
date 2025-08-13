import express from 'express';
import { createUser, deleteUser, getUserByEmail, updateUser, getUserByClerkId } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.put('/users', updateUser);
router.delete('/users', deleteUser);
router.get('/users/:email', getUserByEmail);
router.get('/users', getUserByClerkId);

export default router;
