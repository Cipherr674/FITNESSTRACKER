const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, } = require('../controllers/authController');
const { protect } = require('../middlewares/auth'); // Import the middleware
const{restDays} = require('../controllers/restdayController');
const{getBadges}=require('../controllers/authController')
const User = require("../models/User");
const generateToken = require("../utils/generateToken"); // Ensure this file exists and is configured

router.post('/register', async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    let { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Normalize the email (trim and lowercase)
    email = email.trim().toLowerCase();

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create the new user
    const user = await User.create({ name, email, password });
    console.log("User created successfully:", user);

    // Generate a token for the new user
    const token = generateToken(user._id);

    // Return the token and user data
    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Registration error:", error);

    // Check for a duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use." });
    }
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // Add the middleware here
router.put('/restday', protect, restDays); 
router.get('/badges/:userId',protect,getBadges)

module.exports = router;