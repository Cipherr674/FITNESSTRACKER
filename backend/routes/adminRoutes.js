const router = require('express').Router();
const { protect } = require('../middlewares/auth');
const { getUsers, getUserID, updateUser, deleteUser, getUserWorkouts, getAdminAnalytics } = require('../controllers/adminController');
const { getWorkout,getWorkoutID,updateWorkout,deleteWorkout } = require('../controllers/adminController');
const{getAnalytics}=require('../controllers/adminAnalyticsController');
const{authorize}=require('../middlewares/authorize');


// Admin routes
router.get('/users', protect, authorize(['admin']), getUsers);
router.get('/users/:id', protect, authorize(['admin']), getUserID);
router.put('/users/:id', protect, authorize(['admin']), updateUser);
router.delete('/users/:id', protect, authorize(['admin']), deleteUser);


router.get('/workouts', protect, authorize(['admin']), getWorkout);
router.get('/workouts/:id', protect, authorize(['admin']), getWorkoutID);
router.put('/workouts/:id', protect, authorize(['admin']), updateWorkout);
router.delete('/workouts/:id', protect, authorize(['admin']), deleteWorkout);


router.get("/analytics", protect, authorize(['admin']), getAnalytics);

// Add new route to get user's workouts
router.get('/users/:userId/workouts', protect, authorize(['admin']), getUserWorkouts);

router.get('/analytics', 
  protect,
  authorize(['admin']),
  getAdminAnalytics
);

module.exports = router;