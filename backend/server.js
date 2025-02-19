const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'https://your-frontend-domain.com', // Add your production frontend URL
    'http://localhost:3000' // Keep for local development
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
