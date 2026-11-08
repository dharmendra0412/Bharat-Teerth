import mongoose from 'mongoose';

const PoojaScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const FestivalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  month: { type: String },
  duration: { type: String },
  significance: { type: String }
}, { _id: false });

const TempleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  localName: { type: String },
  regionalScript: { type: String },
  featured: { type: Boolean, default: false, index: true },
  verificationStatus: { 
    type: String, 
    enum: ['verified', 'pending', 'rejected'], 
    default: 'verified',
    index: true 
  },
  verifiedBy: { type: String },
  imageUrl: { type: String, required: true },
  gallery: [{ type: mongoose.Schema.Types.Mixed }],
  location: {
    state: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    district: { type: String },
    address: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    elevationMeters: { type: Number },
    region: { type: String, index: true }
  },
  deity: {
    primary: { type: String, required: true, index: true },
    secondaryDeities: [{ type: String }],
    significance: { type: String }
  },
  history: {
    consecrationEra: { type: String },
    dynasty: { type: String },
    architecturalStyle: { type: String, index: true },
    historicalBackground: { type: String }
  },
  darshanTimings: {
    generalTimings: { type: String },
    dailyPoojaSchedule: [PoojaScheduleSchema],
    specialDarshan: { type: String },
    peakRushHours: { type: String }
  },
  festivals: [FestivalSchema],
  visitorGuidelines: {
    dressCode: { type: String },
    dosAndDonts: [{ type: String }],
    entryFee: { type: String },
    accessibility: { type: String },
    bestTimeToVisit: { type: String }
  },
  nearbyFacilities: {
    nearestAirport: { type: String },
    nearestRailwayStation: { type: String },
    roadConnectivity: { type: String },
    accommodation: { type: String },
    prasadAndDining: { type: String }
  },
  circuits: [{ type: String, index: true }],
  themes: [{ type: String, index: true }],
  contactInfo: {
    helpline: { type: String },
    website: { type: String },
    email: { type: String }
  }
}, {
  timestamps: true
});

// Text index for full-text search across name, localName, city, state, deity
TempleSchema.index({
  name: 'text',
  localName: 'text',
  'location.state': 'text',
  'location.city': 'text',
  'deity.primary': 'text',
  'history.architecturalStyle': 'text'
});

export const Temple = mongoose.models.Temple || mongoose.model('Temple', TempleSchema);

