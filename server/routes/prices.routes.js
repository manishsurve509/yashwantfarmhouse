import express from 'express';
import Price from '../models/Price.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/prices - List all prices
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      prices
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

    const price = await Price.create({
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      unit: unit || 'per night',
      description: description || '',
      badge: badge || '',
      features: Array.isArray(features) ? features : (features ? [features] : []),
      active: active !== undefined ? Boolean(active) : true
    });

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

    const price = await Price.findById(req.params.id);
    if (!price) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    if (title !== undefined) price.title = title.trim();
    if (category !== undefined) price.category = category.trim();
    if (amount !== undefined) price.amount = Number(amount);
    if (unit !== undefined) price.unit = unit;
    if (description !== undefined) price.description = description;
    if (badge !== undefined) price.badge = badge;
    if (features !== undefined) price.features = Array.isArray(features) ? features : [features];
    if (active !== undefined) price.active = Boolean(active);

    await price.save();

    res.json({
      success: true,
      message: 'Price updated successfully.',
      price
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/prices/:id/toggle - Toggle active status
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    if (!price) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    price.active = !price.active;
    await price.save();

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
    const price = await Price.findByIdAndDelete(req.params.id);
    if (!price) {
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
