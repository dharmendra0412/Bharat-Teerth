import express from 'express';
import { db } from '../db/index.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/temple/:templeId
router.get('/temple/:templeId', async (req, res) => {
  try {
    const reviews = await db.getReviewsForTemple(req.params.templeId);
    res.json({
      success: true,
      data: reviews
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving tips.' });
  }
});

// POST /api/reviews - Pilgrim submits a tip/experience
router.post('/', async (req, res) => {
  try {
    const { templeId, author, location, content, rating } = req.body;
    if (!templeId || !author || !content) {
      return res.status(400).json({
        success: false,
        message: 'Temple, Author Name, and Experience details are required.'
      });
    }

    const newTip = await db.addReview({
      templeId,
      author,
      location: location || 'India',
      content,
      rating: rating ? Number(rating) : 5,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      message: 'Pilgrim tip registered and published to the national heritage portal.',
      data: newTip
    });
  } catch (err) {
    console.error('Error submitting pilgrim tip:', err);
    res.status(500).json({ success: false, message: 'Server error saving tip.' });
  }
});

// Handler for fetching all reviews (supports both /all and /admin/all)
const getAllReviewsHandler = async (req, res) => {
  try {
    const all = await db.getAllReviews();
    res.json({
      success: true,
      count: all.length,
      data: all
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching reviews list.' });
  }
};

router.get('/all', authenticateAdmin, getAllReviewsHandler);
router.get('/admin/all', authenticateAdmin, getAllReviewsHandler);

// Handler for moderating a review (supports PUT /:id/status and PATCH /:id/moderate)
const moderateReviewHandler = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const updated = await db.moderateReview(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pilgrim tip not found.' });
    }
    res.json({
      success: true,
      message: `Tip moderation status set to ${status}.`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error moderating tip.' });
  }
};

router.put('/:id/status', authenticateAdmin, moderateReviewHandler);
router.patch('/:id/moderate', authenticateAdmin, moderateReviewHandler);

export default router;
