const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getProfile, updateProfile, updateGoals } = require("../controllers/userController");
const upload = require("../utils/multer");
const User = require('../models/User');

// GET user profile
router.get("/profile", protect, getProfile);

// Update profile (bio/profile picture)
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);

// Update goals
router.put("/goals", protect, updateGoals);

// Add subscription status endpoint
router.get('/subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let daysLeft = 0;
    if (user.subscriptionStatus === 'trial') {
      const trialEnd = new Date(user.trialStartDate);
      trialEnd.setDate(trialEnd.getDate() + 7);
      daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
    } else if (user.subscriptionStatus === 'active') {
      daysLeft = Math.ceil((user.subscriptionEndDate - new Date()) / (1000 * 60 * 60 * 24));
    }

    res.json({
      status: user.subscriptionStatus,
      daysLeft: daysLeft > 0 ? daysLeft : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

