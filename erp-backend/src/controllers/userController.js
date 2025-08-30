import User from "../models/User.js";

// GET all users
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// CREATE user
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
