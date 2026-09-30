import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/settings - Get settings
router.get('/', async (req, res) => {
  try {
    let settings = null;

    if (isDBConnected()) {
      try {
        settings = await SiteSetting.findOne();
      } catch (e) {
        console.warn('DB settings find failed, using memory store:', e.message);
      }
    }

    if (!settings) {
      settings = memoryStore.getSettings();
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings - Update settings
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

    let dbSettings = null;

    if (isDBConnected()) {
      try {
        dbSettings = await SiteSetting.findOne();
        if (!dbSettings) {
          dbSettings = new SiteSetting();
        }

        if (farmhouseName !== undefined) dbSettings.farmhouseName = farmhouseName.trim();
        if (nameMarathi !== undefined) dbSettings.nameMarathi = nameMarathi.trim();
        if (tagline !== undefined) dbSettings.tagline = tagline.trim();
        if (owner !== undefined) dbSettings.owner = owner.trim();
        if (phonePrimary !== undefined) dbSettings.phonePrimary = phonePrimary.trim();
        if (phonePrimaryDisplay !== undefined) dbSettings.phonePrimaryDisplay = phonePrimaryDisplay.trim();
        if (phoneSecondary !== undefined) dbSettings.phoneSecondary = phoneSecondary.trim();
        if (phoneSecondaryDisplay !== undefined) dbSettings.phoneSecondaryDisplay = phoneSecondaryDisplay.trim();
        if (whatsappNumber !== undefined) dbSettings.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
        if (locationVillage !== undefined) dbSettings.locationVillage = locationVillage.trim();
        if (locationCity !== undefined) dbSettings.locationCity = locationCity.trim();
        if (locationState !== undefined) dbSettings.locationState = locationState.trim();
        if (locationFull !== undefined) dbSettings.locationFull = locationFull.trim();
        if (locationShort !== undefined) dbSettings.locationShort = locationShort.trim();
        if (mapsUrl !== undefined) dbSettings.mapsUrl = mapsUrl.trim();
        if (mapsEmbedUrl !== undefined) dbSettings.mapsEmbedUrl = mapsEmbedUrl.trim();

        await dbSettings.save();
      } catch (e) {
        console.warn('DB settings update failed, saving to memory store:', e.message);
      }
    }

    // Always update memory store
    const updatedMem = memoryStore.updateSettings({
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
      ...(mapsEmbedUrl !== undefined && { mapsEmbedUrl: mapsEmbedUrl.trim() })
    });

    res.json({
      success: true,
      message: 'Farmhouse settings updated successfully.',
      settings: dbSettings || updatedMem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

