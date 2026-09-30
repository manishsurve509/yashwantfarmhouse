import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/enquiries - List all customer enquiries (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      enquiries
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

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

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
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
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
