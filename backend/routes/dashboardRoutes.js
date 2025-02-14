// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getDashboardAnalytics, getMilestones } = require("../controllers/dashboardController");

router.get("/", protect, getDashboardAnalytics);
router.get('/milestones', protect, getMilestones);

module.exports = router;
