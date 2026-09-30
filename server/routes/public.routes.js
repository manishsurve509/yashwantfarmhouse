import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import Price from '../models/Price.js';
import Availability from '../models/Availability.js';
import Gallery from '../models/Gallery.js';
import Enquiry from '../models/Enquiry.js';
import { isDBConnected } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const router = express.Router();

// GET /api/public/data - All dynamic content for the public website
router.get('/data', async (req, res) => {
  try {
    let settings = null;
    let prices = null;
    let availabilityMap = {};
    let gallery = null;

    if (isDBConnected()) {
      try {
        const [dbSettings, dbPrices, dbAvailability, dbGallery] = await Promise.all([
          SiteSetting.findOne(),
          Price.find({ active: true }).sort({ order: 1, createdAt: 1 }),
          Availability.find().select('date status guestCount -_id'),
          Gallery.find().sort({ featured: -1, order: 1, createdAt: -1 })
        ]);

        settings = dbSettings;
        prices = dbPrices;
        gallery = dbGallery;

        if (dbAvailability) {
          dbAvailability.forEach(item => {
            availabilityMap[item.date] = item.status;
          });
        }
      } catch (dbErr) {
        console.warn('DB read failed, falling back to memory store:', dbErr.message);
      }
    }

    // Fallbacks if DB returned empty or wasn't connected
    if (!settings) settings = memoryStore.getSettings();
    if (!prices || prices.length === 0) prices = memoryStore.getPrices().filter(p => p.active);
    if (Object.keys(availabilityMap).length === 0) {
      const memAvail = memoryStore.getAvailability();
      Object.entries(memAvail).forEach(([d, val]) => {
        availabilityMap[d] = typeof val === 'string' ? val : val.status;
      });
    }
    if (!gallery || gallery.length === 0) gallery = memoryStore.getGallery();

    res.json({
      success: true,
      data: {
        settings,
        prices,
        availability: availabilityMap,
        gallery,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in /api/public/data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve site data'
    });
  }
});


// POST /api/public/enquiry - Customer submits booking enquiry
router.post('/enquiry', async (req, res) => {
  try {
    const { name, phone, email, date, guests, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required.'
      });
    }

    let enquiryId = null;

    if (isDBConnected()) {
      try {
        const enquiry = await Enquiry.create({
          name: name.trim(),
          phone: phone.trim(),
          email: email ? email.trim() : '',
          preferredDate: date || '',
          guests: guests || '1-5',
          message: message ? message.trim() : '',
          status: 'new'
        });
        enquiryId = enquiry._id;
      } catch (dbErr) {
        console.warn('DB enquiry create failed, using memory store:', dbErr.message);
      }
    }

    if (!enquiryId) {
      const memEnq = memoryStore.addEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : '',
        preferredDate: date || '',
        guests: guests || '1-5',
        message: message ? message.trim() : ''
      });
      enquiryId = memEnq._id;
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! The farmhouse team will contact you shortly.',
      enquiryId
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please try again or WhatsApp us directly.'
    });
  }
});

export default router;

