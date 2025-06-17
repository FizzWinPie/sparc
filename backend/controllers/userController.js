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

// Update user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
