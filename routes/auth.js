const express = require("express");
const User = require("../models/user.js");
const router = express.Router();

// Post a new entry to the user's profile
router.post("/post", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { content } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Invalid post content" });
    }

    // Find the user
    let user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure posts array exists
    if (!user.posts) {
      user.posts = [];
    }

    // Add the new post
    user.posts.push(content);
    await user.save();

    res.json({ message: "Post added successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
