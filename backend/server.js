const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const noCache = require('./middleware/cacheControl');


dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://fitnesstracker-frontend-m4f5.onrender.com'
    : 'http://localhost:5173', // Match Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

app.use(express.json());

// Increase payload size limit if needed
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});



// Serve uploaded files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboards'));
app.use('/api/streak', require('./routes/streakRoutes')); 
app.use('/api/test', require('./utils/test'));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

// Apply to all protected routes
app.use('/dashboard', noCache);
app.use('/profile', noCache);
app.use('/settings', noCache);

// Add security headers for all responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add timeout to server
server.timeout = 30000; // 30 seconds

module.exports = app;
