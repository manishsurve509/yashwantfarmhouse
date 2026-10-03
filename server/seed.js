import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import SiteSetting from './models/SiteSetting.js';
import Price from './models/Price.js';
import Availability from './models/Availability.js';
import Gallery from './models/Gallery.js';
import { connectDB, isDBConnected } from './config/db.js';
import { persistentStore } from './store/memoryStore.js';

export const seedData = async () => {
  try {
    await connectDB();

    if (!isDBConnected()) {
      console.log('[Seed] DB is not connected. Persistent store is active.');
      return;
    }

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
    let existingSettings = await SiteSetting.findOne();
    if (!existingSettings) {
      const savedSettings = persistentStore.getSettings();
      existingSettings = await SiteSetting.create({
        farmhouseName: savedSettings.farmhouseName || 'Yashwant Farmhouse',
        nameMarathi: savedSettings.nameMarathi || 'यशवंत फार्महाऊस',
        tagline: savedSettings.tagline || 'A peaceful farmhouse getaway in Nandwal, Kolhapur.',
        owner: savedSettings.owner || 'Pandurang Yashwant Patil',
        phonePrimary: savedSettings.phonePrimary || '+918010042002',
        phonePrimaryDisplay: savedSettings.phonePrimaryDisplay || '80100 42002',
        phoneSecondary: savedSettings.phoneSecondary || '+919975919947',
        phoneSecondaryDisplay: savedSettings.phoneSecondaryDisplay || '99759 19947',
        whatsappNumber: savedSettings.whatsappNumber || '918010042002',
        locationVillage: savedSettings.locationVillage || 'Nandwal',
        locationCity: savedSettings.locationCity || 'Kolhapur',
        locationState: savedSettings.locationState || 'Maharashtra',
        locationCountry: savedSettings.locationCountry || 'India',
        locationFull: savedSettings.locationFull || 'Nandwal, Kolhapur, Maharashtra, India',
        locationShort: savedSettings.locationShort || 'Nandwal, Kolhapur',
        mapsUrl: savedSettings.mapsUrl || 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw',
        mapsEmbedUrl: savedSettings.mapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000'
      });
      console.log('[Seed] Created default farmhouse settings.');
    }

    // 3. Seed Pricing
    const priceCount = await Price.countDocuments();
    if (priceCount === 0) {
      const diskPrices = persistentStore.getPrices();
      const defaultPrices = diskPrices && diskPrices.length > 0 ? diskPrices.map(({ _id, ...rest }) => rest) : [
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
      const diskGallery = persistentStore.getGallery();
      const defaultPhotos = diskGallery && diskGallery.length > 0 ? diskGallery.map(({ _id, ...rest }) => rest) : [
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

    // 5. Seed Availability if empty
    const availabilityCount = await Availability.countDocuments();
    if (availabilityCount === 0) {
      const diskAvail = persistentStore.getAvailability();
      const diskKeys = Object.keys(diskAvail || {});
      if (diskKeys.length > 0) {
        const toInsert = diskKeys.map(k => ({
          date: k,
          status: diskAvail[k].status || diskAvail[k],
          notes: diskAvail[k].notes || '',
          guestCount: diskAvail[k].guestCount || 0
        }));
        await Availability.insertMany(toInsert);
        console.log(`[Seed] Restored ${toInsert.length} availability dates from persistent store.`);
      }
    }

    // 6. Sync DB to PersistentStore on Disk so disk backup is 100% current
    try {
      const allPrices = await Price.find().sort({ order: 1, createdAt: 1 }).lean();
      if (allPrices.length > 0) {
        persistentStore.data.prices = allPrices.map(p => ({ ...p, _id: p._id.toString() }));
      }

      const allGallery = await Gallery.find().sort({ featured: -1, order: 1, createdAt: -1 }).lean();
      if (allGallery.length > 0) {
        persistentStore.data.gallery = allGallery.map(g => ({ ...g, _id: g._id.toString() }));
      }

      const allAvail = await Availability.find().lean();
      if (allAvail.length > 0) {
        persistentStore.data.availability = {};
        allAvail.forEach(a => {
          persistentStore.data.availability[a.date] = {
            status: a.status,
            notes: a.notes || '',
            guestCount: a.guestCount || 0
          };
        });
      }

      const dbSettings = await SiteSetting.findOne().lean();
      if (dbSettings) {
        persistentStore.data.settings = { ...dbSettings, _id: dbSettings._id.toString() };
      }

      persistentStore.save();
      console.log('[Seed] Synchronized database collections to persistent disk storage.');
    } catch (syncErr) {
      console.warn('[Seed] Warning during initial disk sync:', syncErr.message);
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
