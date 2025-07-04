import express from 'express';
import { 
    createUser, 
    deleteUser, 
    updateUser,
    getUserByClerkId,
    getUserByEmail
} from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.put('/users', updateUser); // Update user by ID
router.delete('/users', deleteUser); // delete user by clerkId
router.get("/users/:clerkId", getUserByClerkId);     // Update user by ID
router.get("/users/:email", getUserByEmail); // Get user by email


export default router;
