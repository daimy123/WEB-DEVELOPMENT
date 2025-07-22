const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const MONGODB_URI =
  "mongodb+srv://daimy7940:EVaH3GsBv5i3Tb3g@cluster0.skhpiga.mongodb.net";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Booking endpoints are handled in routes/bookings.js

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bookings", require("./routes/bookings"));

// --- ADMIN USER ROUTES DIRECTLY IN SERVER.JS ---
const User = require("./models/User");

// Get all users (admin)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user (admin)
app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
    });
    await newUser.save();
    res.status(201).json({
      message: "User created",
      user: { username, email, role: newUser.role },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a user (admin)
app.put("/api/users/:id", async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user (admin)
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Note: Booking endpoints have been moved to routes/bookings.js

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
