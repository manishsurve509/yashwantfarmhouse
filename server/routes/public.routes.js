import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import Price from '../models/Price.js';
import Availability from '../models/Availability.js';
import Gallery from '../models/Gallery.js';
import Enquiry from '../models/Enquiry.js';

const router = express.Router();

// GET /api/public/data - All dynamic content for the public website
router.get('/data', async (req, res) => {
  try {
    const [settings, prices, availability, gallery] = await Promise.all([
      SiteSetting.findOne(),
      Price.find({ active: true }).sort({ order: 1, createdAt: 1 }),
      Availability.find().select('date status guestCount -_id'),
      Gallery.find().sort({ featured: -1, order: 1, createdAt: -1 })
    ]);

    // Build availability map { 'YYYY-MM-DD': 'available' | 'booked' | 'unavailable' }
    const availabilityMap = {};
    if (availability) {
      availability.forEach(item => {
        availabilityMap[item.date] = item.status;
      });
    }

    res.json({
      success: true,
      data: {
        settings: settings || {},
        prices: prices || [],
        availability: availabilityMap,
        gallery: gallery || [],
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

    const enquiry = await Enquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      preferredDate: date || '',
      guests: guests || '1-5',
      message: message ? message.trim() : '',
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! The farmhouse team will contact you shortly.',
      enquiryId: enquiry._id
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
