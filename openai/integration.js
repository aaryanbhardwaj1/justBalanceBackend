import express from "express";
import multer from "multer";
import fs from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Route to process the fridge image and return a recipe
app.post("/get-recipe", upload.single("fridgeImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const { allergies, dislikes } = req.body;

    // Read the uploaded image
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    // Step 1: Extract food items from the fridge image using GPT-4-Vision
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: "Identify all visible food items in the image." },
        {
          role: "user",
          content: [
            { type: "text", text: "List all food items visible in this fridge image." },
            { type: "image", image: imageBuffer.toString("base64") },
          ],
        },
      ],
    });

    // Extract detected food items
    const detectedItems = visionResponse.choices[0].message.content;

    // Step 2: Generate a recipe with macros using GPT-4-Turbo
    const recipeResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a recipe assistant. Given a list of available ingredients, suggest an easy recipe while excluding allergens and disliked foods. Include macros: calories, carbs, protein, and fat.",
        },
        {
          role: "user",
          content: `Ingredients available: ${detectedItems}
          Allergies and dislikes: ${allergies}, ${dislikes}
          I need a low-difficulty recipe.
          Return the result in this format:
          
          [RECIPE NAME]
          [INGREDIENTS AND AMOUNT]
          [INSTRUCTIONS]
          
          [CALORIES]
          [CARBS]
          [PROTEIN]
          [FAT]`,
        },
      ],
    });

    // Extract the recipe response
    const recipe = recipeResponse.choices[0].message.content;

    // Clean up uploaded image
    fs.unlinkSync(imagePath);

    res.json({ recipe });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
