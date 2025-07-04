import User from "../models/User.js";

//Create a new user
export const createUser = async (req, res) => {
  let { email, clerkId, firstName } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!firstName) {
    firstName = email.split("@")[0];
  }

  try {
    const user = new User({ email, clerkId, firstName });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Create user error:", error);

    //Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `Duplicate key error: ${field} must be unique`,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

  //default to server error
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing user by clerkId
export const updateUser = async (req, res) => {
  const { email, clerkId, firstName } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, 
      { email, firstName }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);

    if (err.code === 11000) {
      return res.status(400).json({ 
        error: `Duplicate key error: ${Object.keys(err.keyPattern).join(", ")} must be unique`,});
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a user by clerkId
export const deleteUser = async (req, res) => {
  const { email, clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ clerkId });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: 'User deleted', user: deletedUser });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Get user by clerkId
export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
