import express from 'express';
import { db } from '../db/index.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate distance between two coordinates in km (Haversine Formula)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// GET /api/temples - list & search temples
router.get('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const filters = {
      search: req.query.search,
      state: req.query.state,
      region: req.query.region,
      theme: req.query.theme,
      city: req.query.city,
      deity: req.query.deity,
      circuit: req.query.circuit,
      architecture: req.query.architecture,
      featured: req.query.featured,
      verified: req.query.verified,
      sortBy: req.query.sortBy
    };

    const temples = await db.getTemples(filters);
    const latencyMs = Date.now() - startTime;

    // Log real search query telemetry to MongoDB if search filter was used
    if (filters.search && filters.search.trim()) {
      db.recordSearch({
        query: filters.search.trim(),
        resultsCount: temples.length,
        latencyMs,
        isSuccess: temples.length > 0
      }).catch(() => {});
    }

    res.json({
      success: true,
      count: temples.length,
      data: temples
    });
  } catch (err) {
    console.error('Error fetching temples:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving temple registry.' });
  }
});

// GET /api/temples/:id - single temple with nearby recommendations and pilgrim tips
router.get('/:id', async (req, res) => {
  try {
    const temple = await db.getTempleById(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found in national registry.' });
    }

    // Find nearby temples within ~200km
    const allTemples = await db.getTemples();
    const nearby = allTemples
      .filter(t => t.id !== temple.id && t.location?.coordinates && temple.location?.coordinates)
      .map(t => {
        const dist = calculateDistanceKm(
          temple.location.coordinates.lat,
          temple.location.coordinates.lng,
          t.location.coordinates.lat,
          t.location.coordinates.lng
        );
        return {
          id: t.id,
          name: t.name,
          city: t.location.city,
          state: t.location.state,
          imageUrl: t.imageUrl,
          primaryDeity: t.deity.primary,
          distanceKm: dist
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 4);

    const verifiedTips = await db.getReviewsForTemple(temple.id);

    res.json({
      success: true,
      data: temple,
      nearby,
      verifiedTips
    });
  } catch (err) {
    console.error('Error fetching temple by id:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving temple details.' });
  }
});

// POST /api/temples - Admin create temple
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, location, deity } = req.body;
    if (!name || !location?.state || !location?.city || !deity?.primary) {
      return res.status(400).json({
        success: false,
        message: 'Name, State, City, and Primary Deity are required fields.'
      });
    }

    const created = await db.createTemple(req.body);
    res.status(201).json({
      success: true,
      message: 'Temple heritage record successfully registered in national repository.',
      data: created
    });
  } catch (err) {
    console.error('Error creating temple:', err);
    res.status(500).json({ success: false, message: 'Server error creating temple record.' });
  }
});

// PUT /api/temples/:id - Admin update temple
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await db.updateTemple(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Temple record not found to update.' });
    }
    res.json({
      success: true,
      message: 'Temple details updated successfully.',
      data: updated
    });
  } catch (err) {
    console.error('Error updating temple:', err);
    res.status(500).json({ success: false, message: 'Server error updating temple.' });
  }
});

// DELETE /api/temples/:id - Admin delete temple
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deleted = await db.deleteTemple(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Temple not found to delete.' });
    }
    res.json({
      success: true,
      message: 'Temple record safely removed from repository.'
    });
  } catch (err) {
    console.error('Error deleting temple:', err);
    res.status(500).json({ success: false, message: 'Server error deleting temple.' });
  }
});

export default router;
