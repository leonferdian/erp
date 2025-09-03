import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/erp_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to:", MONGO_URI))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));


// MongoDB connection
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/erp_db";
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch((err) => console.error("❌ MongoDB error:", err));

// const MONGO_URI = "mongodb://127.0.0.1:27017/erp_db";
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected to:", MONGO_URI))
// .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ERP Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
