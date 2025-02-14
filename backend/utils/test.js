const express = require('express');
const router = express.Router();
const { sendStreakReminderEmail } = require('../utils/notificationUtils');
const User = require('../models/User');

// Test route to manually trigger the streak reminder
router.post('/test-streak-reminder', async (req, res) => {
    try {
        const users = await User.find();
        users.forEach(user => {
            const currentDate = new Date();
            const lastWorkoutDate = new Date(user.lastWorkoutDate);
            const timeDiff = currentDate - lastWorkoutDate;

            if (timeDiff > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
                sendStreakReminderEmail(user.email, user.name);
            }
        });
        res.status(200).json({ message: "Test streak reminder sent." });
    } catch (error) {
        console.error("Error sending test reminder: ", error);  // Log full error
        res.status(500).json({ message: "Error sending test reminder.", error: error.message });
    }
});


module.exports = router;
