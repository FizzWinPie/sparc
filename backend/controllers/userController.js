import User from '../models/User.js';

export const createUser = async (req, res) => {
  const { email, clerkId } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = new User({ email, clerkId });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
