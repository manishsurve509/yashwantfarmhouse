import express from 'express';
import Availability from '../models/Availability.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { persistentStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/availability - Get all dates or filter by month/year
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
        const map = {};
        records.forEach(r => {
          map[r.date] = { status: r.status, notes: r.notes || '', guestCount: r.guestCount || 0 };
        });

        // Sync persistent disk store
        if (!month && !year) {
          persistentStore.data.availability = {};
        }
        records.forEach(r => {
          persistentStore.data.availability[r.date] = {
            status: r.status,
            notes: r.notes || '',
            guestCount: r.guestCount || 0,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString()
          };
        });
        persistentStore.save();

        return res.json({
          success: true,
          records,
          map
        });
      } catch (e) {
        console.warn('[Availability API] DB find failed, falling back to persistent store:', e.message);
      }
    }

    // Persistent disk store fallback
    const diskAvail = persistentStore.getAvailability();
    const records = [];
    const map = {};

    Object.entries(diskAvail).forEach(([date, val]) => {
      if (month && year) {
        const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
        if (!date.startsWith(monthPrefix)) return;
      }
      const item = {
        date,
        status: typeof val === 'string' ? val : val.status,
        notes: typeof val === 'object' ? (val.notes || '') : '',
        guestCount: typeof val === 'object' ? (val.guestCount || 0) : 0
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

// Handler for single date update (used for both POST and PUT)
const handleSaveDate = async (req, res) => {
  try {
    const { date, status, notes, guestCount } = req.body;

    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Date (YYYY-MM-DD) and status (available, booked, unavailable) are required.'
      });
    }

    const cleanStatus = status.toLowerCase().trim();
    if (!['available', 'booked', 'unavailable'].includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be available, booked, or unavailable.'
      });
    }

    let updated = null;

    if (isDBConnected()) {
      try {
        const existing = await Availability.findOne({ date });
        const updateDoc = {
          status: cleanStatus,
          updatedAt: new Date()
        };

        // Update ONLY fields that are provided, preserving all others
        if (notes !== undefined) updateDoc.notes = notes;
        else if (existing) updateDoc.notes = existing.notes;
        else updateDoc.notes = '';

        if (guestCount !== undefined) updateDoc.guestCount = Number(guestCount) || 0;
        else if (existing) updateDoc.guestCount = existing.guestCount;
        else updateDoc.guestCount = 0;

        updated = await Availability.findOneAndUpdate(
          { date },
          { $set: updateDoc },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.warn('[Availability API] DB update failed:', e.message);
      }
    }

    // Always update persistent disk store
    const diskRecord = persistentStore.setAvailability(
      date,
      cleanStatus,
      notes !== undefined ? notes : (updated?.notes || ''),
      guestCount !== undefined ? guestCount : (updated?.guestCount || 0)
    );

    res.json({
      success: true,
      message: `Date ${date} marked as ${cleanStatus}. Saved permanently to database.`,
      record: updated || { date, ...diskRecord }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/availability
router.post('/', authMiddleware, handleSaveDate);

// PUT /api/availability
router.put('/', authMiddleware, handleSaveDate);

// Handler for batch updates (used for both POST and PUT)
const handleBatchSave = async (req, res) => {
  try {
    const { dates, status, notes } = req.body;

    if (!Array.isArray(dates) || dates.length === 0 || !status) {
      return res.status(400).json({
        success: false,
        message: 'Dates array and status are required.'
      });
    }

    const cleanStatus = status.toLowerCase().trim();

    if (isDBConnected()) {
      try {
        const operations = dates.map(date => ({
          updateOne: {
            filter: { date },
            update: {
              $set: {
                status: cleanStatus,
                notes: notes || '',
                updatedAt: new Date()
              }
            },
            upsert: true
          }
        }));

        await Availability.bulkWrite(operations);
      } catch (e) {
        console.warn('[Availability API] DB bulkWrite failed:', e.message);
      }
    }

    // Always update persistent disk store
    persistentStore.batchSetAvailability(dates, cleanStatus, notes || '');

    res.json({
      success: true,
      message: `Successfully updated ${dates.length} dates to ${cleanStatus}. Saved permanently.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/availability/batch
router.post('/batch', authMiddleware, handleBatchSave);

// PUT /api/availability/batch
router.put('/batch', authMiddleware, handleBatchSave);

// DELETE /api/availability/:date - Clear/reset a date record
router.delete('/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;

    if (isDBConnected()) {
      try {
        await Availability.findOneAndDelete({ date });
      } catch (e) {
        console.warn('[Availability API] DB delete failed:', e.message);
      }
    }

    persistentStore.deleteAvailability(date);

    res.json({
      success: true,
      message: `Date ${date} reset to available in database.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
