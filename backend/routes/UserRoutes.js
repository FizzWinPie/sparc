import express from 'express';
import { createUser } from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('User API is working');
})

router.get('/new', (req, res) => {
    res.send('New user router')
})

router.post('/', (req, res) => {
    res.send('Create user')
})

router
.route('/:id')
.get((req, res) => {
    res.send(`Get user with ID: ${req.params.id}`)
})
.put(updateUser)
.delete((req, res) => {
    res.send(`Delete user with ID: ${req.params.id}`)
})

export default router;
