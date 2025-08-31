import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1h" }); // 3 hours
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        refreshToken,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newToken = generateToken(user._id, user.role);
    res.json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};
