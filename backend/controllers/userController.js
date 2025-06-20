import User from "../models/User.js";

export const createUser = async (req, res) => {
  const { email, clerkId } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = new User({ email, clerkId });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { email, clerkId } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedUser = User.findByIdAndUpdate({ clerkId }, { email }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { email, clerkId } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const deletedUser = User.findByIdAndDelete({ clerkId });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: 'User deleted', user: deletedUser });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
