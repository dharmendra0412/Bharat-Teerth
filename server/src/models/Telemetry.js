import mongoose from 'mongoose';

// Real Search Activity Log Schema
const SearchLogSchema = new mongoose.Schema({
  query: { type: String, required: true, trim: true },
  resultsCount: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
  isSuccess: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

// Real Visitor Session & Engagement Schema
const VisitorSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  deviceType: { type: String, enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' },
  durationSeconds: { type: Number, default: 0 },
  pagesViewed: { type: [String], default: [] },
  lastActiveAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

export const SearchLog = mongoose.models.SearchLog || mongoose.model('SearchLog', SearchLogSchema);
export const VisitorSession = mongoose.models.VisitorSession || mongoose.model('VisitorSession', VisitorSessionSchema);

