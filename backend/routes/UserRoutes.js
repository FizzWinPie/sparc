import express from 'express';
import { createUser, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.put('/users', updateUser);
router.delete('/users', deleteUser);

export default router;
