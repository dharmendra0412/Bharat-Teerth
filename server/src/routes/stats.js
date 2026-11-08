import express from 'express';
import { db } from '../db/index.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats - Public summary metrics
router.get('/', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving statistics.' });
  }
});

// POST /api/stats/ping - Record real visitor session heartbeat and duration in MongoDB
router.post('/ping', async (req, res) => {
  try {
    const { sessionId, deviceType, durationSeconds, page } = req.body || {};
    if (sessionId) {
      await db.recordSessionPing({ sessionId, deviceType, durationSeconds, page });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET /api/stats/export - Full database JSON export for Admin backup
router.get('/export', authenticateAdmin, (req, res) => {
  try {
    const exportData = db.getFullExport();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=bharat_temple_heritage_backup_${Date.now()}.json`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate database export.' });
  }
});

export default router;
