import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  templeId: { type: String, required: true, index: true },
  author: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  visitDate: { type: String },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected'], 
    default: 'approved',
    index: true 
  },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true
});

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

