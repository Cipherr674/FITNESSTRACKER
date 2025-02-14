const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getFullAnalytics } = require('../controllers/analyticsController');

router.get('/', protect, getFullAnalytics);

module.exports = router; 