const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user"  // Default role is "user"
  },
  profilePicture: { type: String, default: "" }, // URL for stored image
  bio: { type: String, default: "" },
  goals: [
    {
      description: { type: String, required: true }, // e.g., "Lose 5kg"
      target: { type: Number, required: true }, // e.g., 5 (kg)
      current: { type: Number, default: 0 }, // e.g., 2 (kg lost)
      deadline: { type: Date },
    },
  ],

  cardioRank: { type: String, default: 'Jogger' }, //  Default cardio rank
  strengthRank: { type: String, default: 'Iron' }, //  Default strength rank
  cardioPoints: { type: Number, default: 0 },
  strengthPoints: { type: Number, default: 0 },

  streaks: { type: Number, default: 0 },  //  Streak counter
  lastWorkoutDate: { type: Date },
  streakFrozen: { type: Boolean, default: false },                          
  frozenDate: { type: Date, default: null }, 
  restDays: {type: [String],default:[]},                                     
  freezesRemaining: { type: Number, default: 3 },  // Number of streak freezes available

  workoutCount: {
    type: Number,
    default: 0
  },

  badges: [
    {
      name: String,         // Badge name
      description: String,  // What the badge signifies
      earnedAt: Date        // Date when the badge was earned
    }
  ],

  totalStrengthPoints: { type: Number, default: 0 },
  totalCardioPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  isTrialUsed: { type: Boolean, default: false, required: true },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'trial', 'active'],
    default: 'inactive',
    required: true
  },
  trialStartDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return this.subscriptionStatus === 'trial' ? v !== undefined : true;
      },
      message: 'Trial start date is required for trial subscriptions'
    }
  },
  subscriptionEndDate: Date,
  paymentId: String
});


// Add indexes for leaderboard sorting
userSchema.index({ cardioPoints: -1 }); // Descending index for cardio leaderboard
userSchema.index({ strengthPoints: -1 }); // Descending index for strength leaderboard



// Hash password and normalize email before saving
userSchema.pre('save', async function (next) {
  // Normalize email to lowercase if provided
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  // Only hash if the password is modified
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//  Compare passwords 
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
