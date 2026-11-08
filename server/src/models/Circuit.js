import mongoose from 'mongoose';

const CircuitStopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  order: { type: Number, required: true },
  direction: { type: String },
  element: { type: String },
  significance: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { _id: false });

const CircuitSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sanskritName: { type: String },
  overview: { type: String, required: true },
  deity: { type: String },
  totalStops: { type: Number, required: true },
  durationDays: { type: String },
  bestSeason: { type: String },
  keyStops: [CircuitStopSchema],
  tag: { type: String, index: true }
}, {
  timestamps: true
});

export const Circuit = mongoose.models.Circuit || mongoose.model('Circuit', CircuitSchema);

