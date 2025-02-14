// routes/streakRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/auth');
const { freezeStreak, unfreezeStreak,getStreak } = require('../controllers/streakController');



router.get('/', protect, getStreak);

// Freeze streak endpoint
router.post('/freeze', protect, freezeStreak);

// Unfreeze streak endpoint
router.post('/unfreeze', protect, unfreezeStreak);

module.exports = router;
