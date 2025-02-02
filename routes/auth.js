const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ firstName, lastName, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user (Session-based)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Save user session
    req.session.user = {
      id: user._id,
      email: user.email,
    };

    res.json({ message: "Logged in successfully", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

router.post("/oneline", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Save user session
    req.session.user = {
      id: user._id,
      email: user.email,
    };

    res.json({ message: "Logged in successfully", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
