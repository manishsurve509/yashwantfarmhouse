import express from 'express';
import Price from '../models/Price.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/prices - List all prices
router.get('/', async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const prices = await Price.find().sort({ order: 1, createdAt: 1 });
        if (prices && prices.length > 0) {
          return res.json({ success: true, prices });
        }
      } catch (e) {
        console.warn('DB prices find failed, falling back to memory store:', e.message);
      }
    }

    res.json({
      success: true,
      prices: memoryStore.getPrices()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/prices - Create price
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, category, amount, unit, description, badge, features, active } = req.body;

    if (!title || !category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and amount are required.'
      });
    }

    const priceData = {
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      unit: unit || 'per night',
      description: description || '',
      badge: badge || '',
      features: Array.isArray(features) ? features : (features ? [features] : []),
      active: active !== undefined ? Boolean(active) : true
    };

    let price = null;

    if (isDBConnected()) {
      try {
        price = await Price.create(priceData);
      } catch (e) {
        console.warn('DB price create failed:', e.message);
      }
    }

    if (!price) {
      price = memoryStore.addPrice(priceData);
    }

    res.status(201).json({
      success: true,
      message: 'Price category created successfully.',
      price
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/prices/:id - Update price
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, category, amount, unit, description, badge, features, active } = req.body;

    let updated = null;

    if (isDBConnected()) {
      try {
        const price = await Price.findById(req.params.id);
        if (price) {
          if (title !== undefined) price.title = title.trim();
          if (category !== undefined) price.category = category.trim();
          if (amount !== undefined) price.amount = Number(amount);
          if (unit !== undefined) price.unit = unit;
          if (description !== undefined) price.description = description;
          if (badge !== undefined) price.badge = badge;
          if (features !== undefined) price.features = Array.isArray(features) ? features : [features];
          if (active !== undefined) price.active = Boolean(active);
          await price.save();
          updated = price;
        }
      } catch (e) {
        console.warn('DB price update failed:', e.message);
      }
    }

    if (!updated) {
      updated = memoryStore.updatePrice(req.params.id, {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(unit !== undefined && { unit }),
        ...(description !== undefined && { description }),
        ...(badge !== undefined && { badge }),
        ...(features !== undefined && { features: Array.isArray(features) ? features : [features] }),
        ...(active !== undefined && { active: Boolean(active) })
      });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    res.json({
      success: true,
      message: 'Price updated successfully.',
      price: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/prices/:id/toggle - Toggle active status
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    let price = null;

    if (isDBConnected()) {
      try {
        price = await Price.findById(req.params.id);
        if (price) {
          price.active = !price.active;
          await price.save();
        }
      } catch (e) {
        console.warn('DB price toggle failed:', e.message);
      }
    }

    if (!price) {
      price = memoryStore.togglePrice(req.params.id);
    }

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    res.json({
      success: true,
      message: `Price marked ${price.active ? 'active' : 'inactive'}.`,
      price
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/prices/:id - Delete price
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let deleted = null;

    if (isDBConnected()) {
      try {
        deleted = await Price.findByIdAndDelete(req.params.id);
      } catch (e) {
        console.warn('DB price delete failed:', e.message);
      }
    }

    if (!deleted) {
      deleted = memoryStore.deletePrice(req.params.id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    res.json({
      success: true,
      message: 'Price category deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

