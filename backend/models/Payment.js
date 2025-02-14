const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  stripePaymentId: String,
  createdAt: { type: Date, default: Date.now }
}); 