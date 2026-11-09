import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { CONFIG } from '../config.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-Memory Brute-Force Rate Limiter (Max 10 login attempts per 15 minutes per IP)
const loginAttempts = new Map();

function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;

  const userAttempts = loginAttempts.get(ip) || [];
  const recentAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many administrative login attempts. Please wait 15 minutes before trying again.'
    });
  }

  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  next();
}

// POST /api/auth/login
router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName || user.full_name
      },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Authentication successful. Welcome to the Temple Heritage Administration Portal.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.full_name,
        designation: user.designation,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// GET /api/auth/me - Validate current session token
router.get('/me', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
