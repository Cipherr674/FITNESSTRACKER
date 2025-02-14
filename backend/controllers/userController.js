const User = require("../models/User");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update profile (bio/profile picture)
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      bio: req.body.bio
    };
    
    // If a file was uploaded, add the path to updates
    if (req.file) {
      updates.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json({ 
      success: true, 
      user,
      message: "Profile updated successfully" 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update goals
exports.updateGoals = async (req, res) => {
  try {
    const { goals } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { goals },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
