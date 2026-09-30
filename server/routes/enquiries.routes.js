import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/enquiries - List all customer enquiries (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        if (enquiries && enquiries.length > 0) {
          return res.json({ success: true, enquiries });
        }
      } catch (e) {
        console.warn('DB enquiries find failed, using memory store:', e.message);
      }
    }

    res.json({
      success: true,
      enquiries: memoryStore.getEnquiries()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/enquiries/:id/status - Update enquiry status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry status.' });
    }

    let enquiry = null;

    if (isDBConnected()) {
      try {
        enquiry = await Enquiry.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );
      } catch (e) {
        console.warn('DB enquiry status update failed:', e.message);
      }
    }

    if (!enquiry) {
      enquiry = memoryStore.updateEnquiryStatus(req.params.id, status);
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: 'Enquiry status updated.',
      enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/enquiries/:id - Delete enquiry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let deleted = null;

    if (isDBConnected()) {
      try {
        deleted = await Enquiry.findByIdAndDelete(req.params.id);
      } catch (e) {
        console.warn('DB enquiry delete failed:', e.message);
      }
    }

    if (!deleted) {
      deleted = memoryStore.deleteEnquiry(req.params.id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

