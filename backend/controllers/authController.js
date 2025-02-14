const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Register User
exports.registerUser = [
  // Validate fields
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>~]/).withMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>~)'),
  
  async (req, res) => {
    console.log('Registration attempt:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          errors: [{ msg: 'Email already registered' }] 
        });
      }

      // Create the user
      const user = await User.create({ name, email, password });

      res.status(201).json({ success: true, user });
    } catch (err) {
      console.error(err);
      // Handle duplicate email error
      if (err.code === 11000) {
        return res.status(400).json({
          errors: [{ msg: 'Email already registered' }]
        });
      }
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
];

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: "Not authorized, user missing" 
      });
    }
    
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean();  // Use lean() for better performance
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ 
      success: false, 
      error: "Error fetching user profile" 
    });
  }
};

exports.getBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('badges');

    res.status(200).json({ success: true, badges: user.badges });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
