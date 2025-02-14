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
app.use(cors({
  origin: [
    'fitness-trackerv21-git-main-cipherr674s-projects.vercel.app', // Your frontend URL
    'https://fitnesstracker-o29w.onrender.com' // Your backend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Increase payload size limit if needed
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});

// Add at the top of your middleware
app.enable('trust proxy');
app.use((req, res, next) => {
  if(process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
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

// Add this before other routes
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

// Add root route
app.get('/', (req, res) => {
  res.redirect('/api/healthcheck');
});

// Add this after all routes to handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
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

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Add timeout to server
server.timeout = 30000; // 30 seconds

module.exports = app;
