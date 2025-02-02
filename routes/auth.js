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

import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API Key in .env
});

router.post("/oneline", async (req, res) => {
  try {
    const { oneline } = req.body;

    if (!oneline || typeof oneline !== "string") {
      return res.status(400).json({ message: "Invalid input. Provide a one-line string." });
    }

    // Send the string to ChatGPT for analysis
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an expert text analyzer. Analyze the given one-line text and provide insights." },
        { role: "user", content: oneline },
      ],
    });

    // Extract the AI response
    const analysis = chatResponse.choices[0].message.content;

    res.json({ message: "Analysis successful", analysis });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
});

export default router;


module.exports = router;
