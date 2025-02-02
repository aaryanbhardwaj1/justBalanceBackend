/*
const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true},
    },
    { timestamps: true}
);

//Hash the password before saving to DB
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RecipeSchema = new mongoose.Schema({
    recipeName: { type: String, required: true },
    ingredients: [
      {
        name: String, // Ingredient name
        amount: String // Example: "2 cups"
      }
    ],
    instructions: { type: String, required: true },
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
  }, { timestamps: true });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // New fields for personal user data
    allergies: [{ type: String, default: [] }], // List of allergies
    restrictions: [{ type: String, default: [] }], // Food restrictions or disliked items
    dietType: [{ type: String, default: [] }], 
    goal: [{ type: String, default: [] }], 
        
    // Array of saved recipes
    savedRecipes: [RecipeSchema]
  },
  { timestamps: true }
);

// Hash the password before saving to the DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
