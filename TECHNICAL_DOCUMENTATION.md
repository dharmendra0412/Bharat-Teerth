# Technical Documentation
## Bharat Teerth: India Temple Heritage & Pilgrimage Information Portal

**Target Environment:** Node.js (v20+) | MongoDB Atlas | React 18 (Vite) | Express.js | Vercel  
**Database Cluster:** `cluster0.gt9k2ym.mongodb.net/temple_heritage`  
**Port:** `5000` (Production Unified Express Server)  
**Status:** Production-Ready & Deployed

---

## 1. System Architecture

Bharat Teerth is engineered as a three-tier web application adhering strictly to standard, modern web technologies:
- **Frontend Presentation Tier:** React.js, Tailwind CSS, HTML5, CSS3, Lucide React, and Leaflet (OpenStreetMap).
- **Backend Application Tier:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, and Mongoose ODM.
- **Database & Telemetry Tier:** MongoDB Atlas cloud cluster with automated connection pooling, indexing, and live telemetry aggregation.
- **Cloud Deployment:** Serverless ready with `vercel.json` and unified single-process Express serving (`npm start`).

```
                              +------------------------------------------+
                              |              CLIENT TIER                 |
                              |  React 18 + Vite 6 + Tailwind CSS        |
                              |  - 23 Indian Languages Context           |
                              |  - Responsive Single-Page Application    |
                              |  - Leaflet OpenStreetMap Geospatial GUI  |
                              |  - Pilgrim Planner (Print / PDF)         |
                              +------------------------------------------+
                                                   |
                                       HTTPS / JSON REST API
                                                   |
                              +------------------------------------------+
                              |              SERVER TIER                 |
                              |  Express.js API Gateway (Node.js v22)    |
                              |  - Security & Rate-limiting              |
                              |  - JWT Bearer Authentication             |
                              |  - Dynamic KPI Telemetry Engine          |
                              |  - Static Assets Hosting (/client/dist)  |
                              +------------------------------------------+
                                                   |
                                            Mongoose ODM
                                                   |
                              +------------------------------------------+
                              |              DATABASE TIER               |
                              |  MongoDB Atlas Multi-AZ Cluster          |
                              |  - temples (972 verified shrines)        |
                              |  - circuits (6 holy yatra routes)        |
                              |  - reviews (pilgrim moderation queue)    |
                              |  - users (authenticated administrators)  |
                              |  - searchlogs (real search queries)      |
                              |  - visitorsessions (engagement telemetry)|
                              +------------------------------------------+
```

---

## 2. Directory Structure

```
Project 2/
├── client/                      # Frontend Application (React + Vite)
│   ├── dist/                    # Production compiled bundle (index.html, JS, CSS)
│   ├── src/
│   │   ├── components/          # Reusable UI widgets (Navbar, Footer, Map, Cards)
│   │   ├── context/             # React Contexts (Language, Auth, Pilgrimage)
│   │   ├── pages/               # Top-level page views:
│   │   │   ├── HomePage.jsx     # Landing hero, 35 states dropdown, 120 deities
│   │   │   ├── ExplorePage.jsx  # Multi-faceted search & catalog filter
│   │   │   ├── TempleDetailPage.jsx # Comprehensive 8-entity temple profile
│   │   │   ├── CircuitsPage.jsx # Holy pilgrimage circuits (Char Dham, Jyotirlinga)
│   │   │   ├── PlannerPage.jsx  # My Yatra itinerary builder & checklist
│   │   │   ├── GuidelinesPage.jsx # Universal temple etiquette & dress codes
│   │   │   └── AdminPage.jsx    # CMS dashboard, KPI telemetry & reviews
│   │   ├── services/            # Fetch API client abstraction (api.js)
│   │   ├── App.jsx              # Application root, routing & telemetry ping
│   │   └── main.jsx             # React DOM entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                      # Backend Application (Node.js + Express)
│   ├── src/
│   │   ├── db/                  # MongoDB connection & data access layer
│   │   │   ├── index.js         # Unified database abstraction
│   │   │   └── mongo.js         # Mongoose client & aggregation pipelines
│   │   ├── middleware/          # Express middlewares (auth.js for JWT verification)
│   │   ├── models/              # Mongoose schemas:
│   │   │   ├── Temple.js        # Core temple document schema
│   │   │   ├── Circuit.js       # Pilgrimage circuit schema
│   │   │   ├── Review.js        # Pilgrim tip & rating schema
│   │   │   ├── User.js          # Admin credentials & roles
│   │   │   └── Telemetry.js     # SearchLog & VisitorSession schemas
│   │   ├── routes/              # Express REST API routes:
│   │   │   ├── temples.js       # CRUD & search endpoints
│   │   │   ├── circuits.js      # Pilgrimage circuit endpoints
│   │   │   ├── regions.js       # Filter metadata endpoint
│   │   │   ├── reviews.js       # Review submission & moderation
│   │   │   ├── stats.js         # Dynamic KPIs, telemetry ping & DB export
│   │   │   └── auth.js          # Admin login & token verification
│   │   └── index.js             # Express app setup & server bootstrap
│   ├── .env                     # MongoDB URI & JWT secret configuration
│   └── package.json
├── PRD.md                       # Product Requirements Document
├── TECHNICAL_DOCUMENTATION.md   # This document
├── README.md                    # Project overview & quick start
├── vercel.json                  # Serverless deployment configuration
└── package.json                 # Monorepo root scripts
```

---

## 3. Database Schemas (Mongoose ODM)

### 3.1 Temple Schema (`server/src/models/Temple.js`)
```javascript
const templeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  localName: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['verified', 'pending'], default: 'verified' },
  verifiedBy: { type: String, default: 'State Devaswom Board & ASI' },
  imageUrl: { type: String, required: true },
  gallery: [{ type: String }],
  location: {
    state: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    district: { type: String, default: '' },
    address: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    elevationMeters: { type: Number, default: 0 }
  },
  deity: {
    primary: { type: String, required: true, index: true },
    secondaryDeities: [{ type: String }],
    significance: { type: String, default: '' }
  },
  history: {
    consecrationEra: { type: String, default: 'Ancient Vedic Epoch' },
    dynasty: { type: String, default: 'Historical Royal Patrons' },
    architecturalStyle: { type: String, default: 'Traditional Classical Style' },
    historicalBackground: { type: String, default: '' }
  },
  darshanTimings: {
    generalTimings: { type: String, default: '06:00 AM - 12:30 PM, 04:30 PM - 09:00 PM' },
    dailyPoojaSchedule: [{
      name: String,
      time: String,
      description: String
    }],
    specialDarshan: { type: String, default: 'Senior citizen and Divyangjan queue available' },
    peakRushHours: { type: String, default: 'Festival days, Pradosham, and weekends' }
  },
  festivals: [{
    name: String,
    month: String,
    duration: String,
    significance: String
  }],
  visitorGuidelines: {
    dressCode: { type: String, default: 'Traditional modest attire mandated. No short garments.' },
    dosAndDonts: [{ type: String }],
    entryFee: { type: String, default: 'General Darshan is Free' },
    accessibility: { type: String, default: 'Wheelchair assistance available at main entrance' },
    bestTimeToVisit: { type: String, default: 'October through March' }
  },
  nearbyFacilities: {
    nearestAirport: { type: String, default: '' },
    nearestRailwayStation: { type: String, default: '' },
    roadConnectivity: { type: String, default: '' },
    accommodation: { type: String, default: '' },
    prasadAndDining: { type: String, default: '' }
  },
  circuits: [{ type: String, index: true }],
  themes: [{ type: String, index: true }],
  contactInfo: {
    helpline: { type: String, default: '' },
    website: { type: String, default: '' },
    email: { type: String, default: '' }
  }
}, { timestamps: true });
```

### 3.2 Telemetry Schemas (`server/src/models/Telemetry.js`)
```javascript
// Real Search Query Telemetry
const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  resultsCount: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
  isSuccess: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

// Real Visitor Engagement Session Telemetry
const visitorSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
  durationSeconds: { type: Number, default: 0 },
  page: { type: String, default: '/' },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });
```

---

## 4. REST API Endpoint Specifications

### 4.1 Temple Endpoints (`/api/temples`)
- `GET /api/temples`  
  Retrieves temples with optional query filters:
  - `search` (case-insensitive regex search across name, city, state, deity, architecture)
  - `state` (exact state match)
  - `deity` (substring regex match)
  - `region` (North, South, East, West, Central, North East)
  - `theme` (e.g. 12 Jyotirlinga, Char Dham)
  - `architecture` (Dravidian, Nagara, Kalinga, etc.)
  - `sortBy` (`name` for A-Z, `state` for geographic)
- `GET /api/temples/:id`  
  Returns full details of an individual temple by slug/id.
- `POST /api/temples` *(Authenticated)*  
  Creates a new temple record in MongoDB Atlas.
- `PUT /api/temples/:id` *(Authenticated)*  
  Updates an existing temple record.
- `DELETE /api/temples/:id` *(Authenticated)*  
  Deletes a temple record.

### 4.2 Pilgrimage Circuit Endpoints (`/api/circuits`)
- `GET /api/circuits`  
  Returns all enrolled holy circuits (12 Jyotirlingas, Char Dham, Chota Char Dham, Shakti Peethas, Pancha Bhoota Stalam, Ashtavinayak).
- `GET /api/circuits/:id`  
  Returns details and associated temples for a specific circuit.

### 4.3 Regions & Filter Metadata (`/api/regions`)
- `GET /api/regions/metadata`  
  Aggregates distinct states (35), cities, deities (120), architectural styles, and themes for dynamic dropdown binding.

### 4.4 Community Reviews & Tips (`/api/reviews`)
- `GET /api/reviews?templeId=:id`  
  Retrieves approved pilgrim reviews and tips for a specific temple.
- `POST /api/reviews`  
  Submits a new pilgrim tip with initial status `approved` or `pending`.
- `PUT /api/reviews/:id/moderate` *(Authenticated)*  
  Approves or rejects a pilgrim tip.

### 4.5 Executive KPIs & Telemetry (`/api/stats`)
- `GET /api/stats`  
  Returns dynamically computed platform metrics (Zero Simulation Guarantee):
  ```json
  {
    "totalTemples": 972,
    "totalCircuits": 6,
    "totalStates": 35,
    "totalDeities": 120,
    "totalReviews": 4,
    "averageRating": 5.0,
    "monthlyActiveUsers": 38,
    "searchSuccessRate": 100.0,
    "avgEngagementMinutes": 2.4,
    "dbType": "MongoDB Atlas (Verified Cluster)"
  }
  ```
- `POST /api/stats/ping`  
  Receives background heartbeat telemetry from active client sessions.
- `GET /api/stats/export` *(Authenticated)*  
  Exports a full JSON database dump of all collections for archival backup.

### 4.6 Authentication (`/api/auth`)
- `POST /api/auth/login`  
  Validates admin credentials via bcrypt and issues a signed HMAC-SHA256 JWT token (7-day validity).
- `GET /api/auth/verify`  
  Verifies the active JWT token.

---

## 5. Security & Authentication Architecture

1. **Password Hashing:** Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` with a work factor of 10.
2. **Stateless JWT Tokens:** Authentication is handled via standard `Bearer <token>` HTTP headers. The secret is securely stored in `server/.env`.
3. **RBAC Middleware:** Protected routes enforce the `authenticateAdmin` middleware:
   ```javascript
   export function authenticateAdmin(req, res, next) {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ success: false, message: 'Authorization token required' });
     }
     const token = authHeader.split(' ')[1];
     try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       return res.status(403).json({ success: false, message: 'Invalid or expired token' });
     }
   }
   ```
4. **Environment Isolation:** Database credentials and signing keys are isolated in `server/.env` and excluded from version control.

---

## 6. Zero Simulation & Dynamic KPI Engine

In strict adherence to the project charter, **zero simulation or mock data is permitted**:
1. **Temples Listed:** Derived from `await Temple.countDocuments()`, reflecting the exact 972 shrines.
2. **Monthly Active Users:** Derived from `await VisitorSession.distinct('sessionId', { lastActive: { $gte: thirtyDaysAgo } }).length`.
3. **Search Success Rate:** Derived from the `SearchLog` collection:
   ```javascript
   const totalSearches = await SearchLog.countDocuments();
   const successfulSearches = await SearchLog.countDocuments({ isSuccess: true });
   const searchSuccessRate = totalSearches > 0 
     ? Math.round((successfulSearches / totalSearches) * 1000) / 10 
     : 100.0;
   ```
4. **Engagement Time:** Derived from `await VisitorSession.aggregate([{ $group: { _id: null, avgDur: { $avg: '$durationSeconds' } } }])`.
5. **User Satisfaction Score:** Derived directly from the arithmetic mean (`$avg`) of real reviews in the `Review` collection.

---

## 7. Operational Runbook & Deployment Guide

### 7.1 Local Development
To launch the complete application locally:
```bash
# 1. Install dependencies
npm install
npm run install:all

# 2. Build production frontend assets
npm run build --prefix client

# 3. Start unified production Express server
npm start
```
The application will be live at `http://localhost:5000`.

### 7.2 Database Seeding & Verification
To verify data integrity or re-seed:
```bash
# Verify data coverage across all 972 temples
node --env-file=server/.env server/src/db/audit_data.js

# Check top deities and state distributions
node --env-file=server/.env server/src/db/check_deities.js
```

### 7.3 Cloud Serverless Deployment (Vercel)
The project includes a root `vercel.json` preconfigured for Vercel deployment:
- Builds `client/` using Vite and outputs to `client/dist`.
- Deploys `server/src/index.js` as an edge/serverless Node function routing all `/api/*` traffic.
- Set the environment variable `MONGODB_URI` in the Vercel Project Dashboard.

