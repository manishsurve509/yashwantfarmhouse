import express from 'express';
import Availability from '../models/Availability.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/availability - Get all dates or filter
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};

    if (month && year) {
      const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
      query.date = { $regex: `^${monthPrefix}` };
    }

    const records = await Availability.find(query).sort({ date: 1 });
    
    // Also build a quick status map
    const map = {};
    records.forEach(r => {
      map[r.date] = { status: r.status, notes: r.notes, guestCount: r.guestCount };
    });

    res.json({
      success: true,
      records,
      map
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/availability - Set or update single date status
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, status, notes, guestCount } = req.body;

    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Date (YYYY-MM-DD) and status (available, booked, unavailable) are required.'
      });
    }

    if (!['available', 'booked', 'unavailable'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be available, booked, or unavailable.'
      });
    }

    const updated = await Availability.findOneAndUpdate(
      { date },
      {
        status,
        notes: notes || '',
        guestCount: guestCount || 0,
        updatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: `Date ${date} marked as ${status}.`,
      record: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/availability/batch - Batch update dates (e.g. date range)
router.post('/batch', authMiddleware, async (req, res) => {
  try {
    const { dates, status, notes } = req.body;

    if (!Array.isArray(dates) || dates.length === 0 || !status) {
      return res.status(400).json({
        success: false,
        message: 'Dates array and status are required.'
      });
    }

    const operations = dates.map(date => ({
      updateOne: {
        filter: { date },
        update: {
          $set: {
            status,
            notes: notes || '',
            updatedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    await Availability.bulkWrite(operations);

    res.json({
      success: true,
      message: `Successfully updated ${dates.length} dates to ${status}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/availability/:date - Clear/reset a date record
router.delete('/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    await Availability.findOneAndDelete({ date });

    res.json({
      success: true,
      message: `Date ${date} reset to available.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
