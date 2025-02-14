const express = require('express');
const Razorpay = require('razorpay');
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/trial', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.isTrialUsed) {
      return res.status(400).json({ error: 'Trial already used' });
    }

    user.isTrialUsed = true;
    user.subscriptionStatus = 'trial';
    user.trialStartDate = new Date();
    
    const savedUser = await user.save();
    if (!savedUser) throw new Error('User save failed');

    res.json({ success: true });
  } catch (err) {
    console.error('Trial Error:', err);
    res.status(500).json({ 
      error: err.message || 'Server error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      if (payment.amount !== 199900) {
        return res.status(400).json({ error: 'Invalid payment amount' });
      }
      const user = await User.findById(req.user.id);
      user.subscriptionStatus = 'active';
      user.subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      user.paymentId = paymentId;
      await user.save();
      return res.json({ success: true });
    }
    
    res.status(400).json({ error: 'Payment failed' });
  } catch (err) {
    console.error('Razorpay API Error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router; 