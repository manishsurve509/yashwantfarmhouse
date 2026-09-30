import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let admin = null;

    if (isDBConnected()) {
      try {
        admin = await Admin.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('DB findOne failed, falling back to memory store:', e.message);
      }
    }

    // Fallback to memory store if not in DB
    if (!admin) {
      admin = memoryStore.getAdminByEmail(normalizedEmail);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    if (admin.save && typeof admin.save === 'function') {
      try { await admin.save(); } catch (_) {}
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
});


// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.'
      });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

export default router;
