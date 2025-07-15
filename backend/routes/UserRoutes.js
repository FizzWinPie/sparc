import express from 'express';
import { createUser, deleteUser, getUserByEmail, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.put('/users', updateUser);
router.delete('/users', deleteUser);
router.get('/users/:email', getUserByEmail);

export default router;
