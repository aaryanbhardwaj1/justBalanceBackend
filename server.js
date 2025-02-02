/*
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,

})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Sample Route
app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Sample API endpoint
app.get("/api/data", (req, res) => {
  res.json({ success: true, data: ["item1", "item2", "item3"] });
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
