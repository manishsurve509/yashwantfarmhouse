import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings - Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
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

    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting();
    }

    if (farmhouseName !== undefined) settings.farmhouseName = farmhouseName.trim();
    if (nameMarathi !== undefined) settings.nameMarathi = nameMarathi.trim();
    if (tagline !== undefined) settings.tagline = tagline.trim();
    if (owner !== undefined) settings.owner = owner.trim();
    if (phonePrimary !== undefined) settings.phonePrimary = phonePrimary.trim();
    if (phonePrimaryDisplay !== undefined) settings.phonePrimaryDisplay = phonePrimaryDisplay.trim();
    if (phoneSecondary !== undefined) settings.phoneSecondary = phoneSecondary.trim();
    if (phoneSecondaryDisplay !== undefined) settings.phoneSecondaryDisplay = phoneSecondaryDisplay.trim();
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
    if (locationVillage !== undefined) settings.locationVillage = locationVillage.trim();
    if (locationCity !== undefined) settings.locationCity = locationCity.trim();
    if (locationState !== undefined) settings.locationState = locationState.trim();
    if (locationFull !== undefined) settings.locationFull = locationFull.trim();
    if (locationShort !== undefined) settings.locationShort = locationShort.trim();
    if (mapsUrl !== undefined) settings.mapsUrl = mapsUrl.trim();
    if (mapsEmbedUrl !== undefined) settings.mapsEmbedUrl = mapsEmbedUrl.trim();

    await settings.save();

    res.json({
      success: true,
      message: 'Farmhouse settings updated successfully.',
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
