import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import SiteSetting from './models/SiteSetting.js';
import Price from './models/Price.js';
import Availability from './models/Availability.js';
import Gallery from './models/Gallery.js';
import { connectDB } from './config/db.js';

export const seedData = async () => {
  try {
    await connectDB();

    // 1. Seed Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@yashwantfarm.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Yashwant2026';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await Admin.create({
        email: adminEmail,
        passwordHash,
        name: 'Pandurang Patil (Manager)',
        role: 'admin'
      });
      console.log(`[Seed] Created authorized admin account: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin account exists: ${existingAdmin.email}`);
    }

    // 2. Seed Site Settings
    const existingSettings = await SiteSetting.findOne();
    if (!existingSettings) {
      await SiteSetting.create({
        farmhouseName: 'Yashwant Farmhouse',
        nameMarathi: 'यशवंत फार्महाऊस',
        tagline: 'A peaceful farmhouse getaway in Nandwal, Kolhapur.',
        owner: 'Pandurang Yashwant Patil',
        phonePrimary: '+918010042002',
        phonePrimaryDisplay: '80100 42002',
        phoneSecondary: '+919975919947',
        phoneSecondaryDisplay: '99759 19947',
        whatsappNumber: '918010042002',
        locationVillage: 'Nandwal',
        locationCity: 'Kolhapur',
        locationState: 'Maharashtra',
        locationCountry: 'India',
        locationFull: 'Nandwal, Kolhapur, Maharashtra, India',
        locationShort: 'Nandwal, Kolhapur',
        mapsUrl: 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw',
        mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000'
      });
      console.log('[Seed] Created default farmhouse settings.');
    }

    // 3. Seed Pricing
    const priceCount = await Price.countDocuments();
    if (priceCount === 0) {
      const defaultPrices = [
        {
          title: 'Weekday Stay',
          category: 'Monday - Thursday',
          amount: 8500,
          unit: 'per night',
          badge: 'Calm Retreat',
          description: 'Peaceful escape for families and friends. Enjoy full private farmhouse access.',
          features: [
            'Entire Private Farmhouse & Grounds',
            'Full Swimming Pool Access',
            'Equipped Kitchen & Cooking Facility',
            'Accommodates up to 10 Guests',
            'Spacious Vehicle Parking',
            'Peaceful Natural Countryside'
          ],
          active: true,
          order: 1
        },
        {
          title: 'Weekend Stay',
          category: 'Friday - Sunday',
          amount: 11000,
          unit: 'per night',
          badge: 'Most Popular',
          description: 'Prime weekend getaway. Perfect for reconnecting with family and friends.',
          features: [
            'Entire Private Farmhouse & Grounds',
            'Full Swimming Pool Access',
            'Equipped Kitchen & Cooking Facility',
            'Accommodates up to 10 Guests',
            'Spacious Vehicle Parking',
            'Evening Lawn Gathering Space'
          ],
          active: true,
          order: 2
        },
        {
          title: 'Day Outing / Picnic',
          category: 'Day Visit (10 AM - 6 PM)',
          amount: 5500,
          unit: 'day pass',
          badge: 'Day Pass',
          description: 'Relaxing day getaway with friends or family without overnight stay.',
          features: [
            'Swimming Pool Access all day',
            'Open Lawn & Shaded Veranda',
            'Cooking & Dining Facility',
            'Up to 10 Visitors included',
            'Changing Rooms & Washrooms',
            'Secure On-site Parking'
          ],
          active: true,
          order: 3
        },
        {
          title: 'Extra Guest',
          category: 'Per Person',
          amount: 500,
          unit: 'per person',
          badge: '',
          description: 'For groups larger than 10 people. Extra mattress and facility access provided.',
          features: [
            'Additional Bedding & Linen',
            'Full Access to All Amenities',
            'Children under 5 stay free'
          ],
          active: true,
          order: 4
        }
      ];

      await Price.insertMany(defaultPrices);
      console.log(`[Seed] Seeded ${defaultPrices.length} price categories.`);
    }

    // 4. Seed Gallery Photos
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      const defaultPhotos = [
        {
          imageUrl: '/images/farmhouse-exterior-2.jpg',
          imageName: 'farmhouse-exterior-2.jpg',
          altText: 'Yashwant Farmhouse — full property view with swimming pool and lush greenery',
          featured: true,
          category: 'Property',
          order: 1
        },
        {
          imageUrl: '/images/farmhouse-exterior-1.jpg',
          imageName: 'farmhouse-exterior-1.jpg',
          altText: 'Yashwant Farmhouse — red-brick cottage with traditional tiled roof and pool',
          featured: false,
          category: 'Architecture',
          order: 2
        },
        {
          imageUrl: '/images/farmhouse-pool-view.jpg',
          imageName: 'farmhouse-pool-view.jpg',
          altText: 'Private swimming pool at Yashwant Farmhouse with surrounding countryside',
          featured: false,
          category: 'Pool',
          order: 3
        },
        {
          imageUrl: '/images/farmhouse-logo.jpg',
          imageName: 'farmhouse-logo.jpg',
          altText: 'Yashwant Farmhouse branding — यशवंत फार्महाऊस Nandwal, Kolhapur',
          featured: false,
          category: 'Brand',
          order: 4
        }
      ];

      await Gallery.insertMany(defaultPhotos);
      console.log(`[Seed] Seeded ${defaultPhotos.length} gallery photos.`);
    }

    // 5. Seed Availability for current and next 2 months
    const availabilityCount = await Availability.countDocuments();
    if (availabilityCount === 0) {
      const today = new Date();
      const datesToSeed = [];

      for (let i = 0; i < 60; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay(); // 0 is Sun, 6 is Sat

        // Random realistic availability: mark occasional weekends booked, some available
        let status = 'available';
        let notes = '';

        if (i === 2 || i === 3) {
          status = 'booked';
          notes = 'Family Weekend Booking';
        } else if (i === 9 || i === 10) {
          status = 'booked';
          notes = 'Private Reunion Stay';
        } else if (i === 16) {
          status = 'booked';
          notes = 'Reserved';
        } else if (i === 23) {
          status = 'unavailable';
          notes = 'Property Maintenance';
        }

        datesToSeed.push({
          date: dateStr,
          status,
          notes
        });
      }

      await Availability.insertMany(datesToSeed);
      console.log(`[Seed] Seeded availability for next 60 days.`);
    }

    console.log('[Seed] Database initialization complete!');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error.message);
  }
};

// If run directly: node server/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedData().then(() => {
    console.log('Seed finished, exiting.');
    process.exit(0);
  });
}
