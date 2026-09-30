import express from 'express';
import Availability from '../models/Availability.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/availability - Get all dates or filter
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (isDBConnected()) {
      try {
        let query = {};
        if (month && year) {
          const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
          query.date = { $regex: `^${monthPrefix}` };
        }

        const records = await Availability.find(query).sort({ date: 1 });
        if (records && records.length > 0) {
          const map = {};
          records.forEach(r => {
            map[r.date] = { status: r.status, notes: r.notes, guestCount: r.guestCount };
          });

          return res.json({
            success: true,
            records,
            map
          });
        }
      } catch (e) {
        console.warn('DB availability find failed, using memory store:', e.message);
      }
    }

    // Memory store fallback
    const memAvail = memoryStore.getAvailability();
    const records = [];
    const map = {};

    Object.entries(memAvail).forEach(([date, val]) => {
      const item = {
        date,
        status: typeof val === 'string' ? val : val.status,
        notes: val.notes || '',
        guestCount: val.guestCount || 0
      };
      records.push(item);
      map[date] = item;
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

    let updated = null;

    if (isDBConnected()) {
      try {
        updated = await Availability.findOneAndUpdate(
          { date },
          {
            status,
            notes: notes || '',
            guestCount: guestCount || 0,
            updatedAt: new Date()
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.warn('DB availability update failed:', e.message);
      }
    }

    // Always keep memoryStore in sync
    const memRecord = memoryStore.setAvailability(date, status, notes || '', guestCount || 0);

    res.json({
      success: true,
      message: `Date ${date} marked as ${status}.`,
      record: updated || { date, ...memRecord }
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

    if (isDBConnected()) {
      try {
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
      } catch (e) {
        console.warn('DB availability bulkWrite failed:', e.message);
      }
    }

    // Always keep memory store updated
    memoryStore.batchSetAvailability(dates, status, notes || '');

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

    if (isDBConnected()) {
      try {
        await Availability.findOneAndDelete({ date });
      } catch (e) {
        console.warn('DB availability delete failed:', e.message);
      }
    }

    memoryStore.deleteAvailability(date);

    res.json({
      success: true,
      message: `Date ${date} reset to available.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

