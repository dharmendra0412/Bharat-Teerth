import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

router.get('/metadata', async (req, res) => {
  try {
    const meta = await db.getFilterMetadata();
    res.json({
      success: true,
      data: meta
    });
  } catch (err) {
    console.error('Error fetching region metadata:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving metadata.' });
  }
});

export default router;
