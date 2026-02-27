require("dotenv").config();

// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");

// Import models
const User = require("./models/User");
const City = require("./models/City");

// Utilities
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Middleware
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= DATABASE CONNECTION =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= BASIC ROUTE =================

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ================= REGISTER =================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// ================= LOGIN =================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});

// ================= CITIES =================

app.post("/cities", auth, async (req, res) => {
  try {
    const { cityName } = req.body;
    const formattedCity = cityName.trim().toLowerCase();

    const existingCity = await City.findOne({
      userId: req.user.id,
      cityName: formattedCity,
    });

    if (existingCity) {
      return res.status(400).json({ message: "City already exists" });
    }

    const newCity = await City.create({
      userId: req.user.id,
      cityName: formattedCity,
    });

    res.json(newCity);
  } catch (error) {
    res.status(500).json({ message: "Error adding city" });
  }
});

app.get("/cities", auth, async (req, res) => {
  try {
    const cities = await City.find({ userId: req.user.id });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities" });
  }
});

app.patch("/cities/:id/favorite", auth, async (req, res) => {
  try {
    const city = await City.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.isFavorite = !city.isFavorite;
    await city.save();

    res.json(city);
  } catch (error) {
    res.status(500).json({ message: "Error updating favorite" });
  }
});

app.delete("/cities/:id", auth, async (req, res) => {
  try {
    const deletedCity = await City.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting city" });
  }
});

// ================= WEATHER =================

app.get("/weather/:city", auth, async (req, res) => {
  try {
    const city = req.params.city;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      weather: response.data.weather[0].description,
      humidity: response.data.main.humidity,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching weather" });
  }
});

// ================= MOCK AI WEATHER INSIGHT =================

app.get("/ai-insight/:city", auth, async (req, res) => {
  try {
    const city = req.params.city;

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = weatherResponse.data;

    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].description;

    let insight = "";

    if (temp > 30) {
      insight = `It's a warm and intense day in ${city}. Perfect for slowing down and letting the evening breeze do the magic.`;
    } else if (temp < 15) {
      insight = `A cool and quiet mood wraps around ${city}. Feels like a day for comfort and soft moments indoors.`;
    } else {
      insight = `The weather in ${city} feels balanced and gentle. A calm day to move softly and breathe deeply.`;
    }

    if (condition.includes("rain")) {
      insight += " A little rain adds romance to the air.";
    }

    res.json({ insight });

  } catch (error) {
    res.status(500).json({ message: "AI insight failed" });
  }
});

// ================= START SERVER =================

app.listen(5000, () => {
  console.log("Server started on port 5000");
});