const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user.js");

const router = express.Router();

router.post("/save", authMiddleware, async (req, res) => {
    try {
      const { recipeName, ingredients, instructions, calories, carbs, protein, fat } = req.body;
  
      // Ensure all required fields are provided
      if (!recipeName || !ingredients || !instructions || calories == null || carbs == null || protein == null || fat == null) {
        return res.status(400).json({ message: "All recipe fields are required" });
      }
  
      const user = await User.findById(req.session.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Create a new recipe object
      const newRecipe = {
        recipeName,
        ingredients,
        instructions,
        calories,
        carbs,
        protein,
        fat,
      };
  
      // Add to user's saved recipes
      user.savedRecipes.push(newRecipe);
      await user.save();
  
      res.status(201).json({ message: "Recipe saved successfully", savedRecipes: user.savedRecipes });
    } catch (error) {
      console.error("Recipe Save Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/saved", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id).select("savedRecipes");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ savedRecipes: user.savedRecipes });

    } catch (error) {
      console.error("Fetch Saved Recipes Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.delete("/saved/:recipeId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedRecipes = user.savedRecipes.filter(recipe => recipe._id.toString() !== req.params.recipeId);
    await user.save();

    res.json({ message: "Recipe deleted successfully", savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Delete Recipe Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
  
module.exports = router;