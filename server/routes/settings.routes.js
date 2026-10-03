import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { persistentStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/settings - Get settings
router.get('/', async (req, res) => {
  try {
    let settings = null;

    if (isDBConnected()) {
      try {
        settings = await SiteSetting.findOne();
        if (settings) {
          persistentStore.data.settings = {
            ...settings.toObject(),
            _id: settings._id.toString()
          };
          persistentStore.save();
        }
      } catch (e) {
        console.warn('[Settings API] DB settings find failed, using persistent store:', e.message);
      }
    }

    if (!settings) {
      settings = persistentStore.getSettings();
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings - Update settings (Permanent Persistence)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const {
      farmhouseName,
      nameMarathi,
      tagline,
      owner,
      phonePrimary,
      phonePrimaryDisplay,
      phoneSecondary,
      phoneSecondaryDisplay,
      whatsappNumber,
      locationVillage,
      locationCity,
      locationState,
      locationFull,
      locationShort,
      mapsUrl,
      mapsEmbedUrl
    } = req.body;

    const updateFields = {
      ...(farmhouseName !== undefined && { farmhouseName: farmhouseName.trim() }),
      ...(nameMarathi !== undefined && { nameMarathi: nameMarathi.trim() }),
      ...(tagline !== undefined && { tagline: tagline.trim() }),
      ...(owner !== undefined && { owner: owner.trim() }),
      ...(phonePrimary !== undefined && { phonePrimary: phonePrimary.trim() }),
      ...(phonePrimaryDisplay !== undefined && { phonePrimaryDisplay: phonePrimaryDisplay.trim() }),
      ...(phoneSecondary !== undefined && { phoneSecondary: phoneSecondary.trim() }),
      ...(phoneSecondaryDisplay !== undefined && { phoneSecondaryDisplay: phoneSecondaryDisplay.trim() }),
      ...(whatsappNumber !== undefined && { whatsappNumber: whatsappNumber.replace(/[^0-9]/g, '') }),
      ...(locationVillage !== undefined && { locationVillage: locationVillage.trim() }),
      ...(locationCity !== undefined && { locationCity: locationCity.trim() }),
      ...(locationState !== undefined && { locationState: locationState.trim() }),
      ...(locationFull !== undefined && { locationFull: locationFull.trim() }),
      ...(locationShort !== undefined && { locationShort: locationShort.trim() }),
      ...(mapsUrl !== undefined && { mapsUrl: mapsUrl.trim() }),
      ...(mapsEmbedUrl !== undefined && { mapsEmbedUrl: mapsEmbedUrl.trim() }),
      updatedAt: new Date()
    };

    let dbSettings = null;

    if (isDBConnected()) {
      try {
        dbSettings = await SiteSetting.findOneAndUpdate(
          {},
          { $set: updateFields },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.warn('[Settings API] DB settings update failed:', e.message);
      }
    }

    // Always update persistent disk store
    const diskSettings = persistentStore.updateSettings(updateFields);

    res.json({
      success: true,
      message: 'Farmhouse settings saved permanently to database.',
      settings: dbSettings || diskSettings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
