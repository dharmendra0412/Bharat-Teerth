import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'SUPER_ADMIN' },
  fullName: { type: String },
  designation: { type: String }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

