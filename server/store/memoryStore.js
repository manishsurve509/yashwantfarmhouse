import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Pre-computed bcrypt hash for 'Admin@Yashwant2026'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Admin@Yashwant2026', 10);

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[PersistentStore] Could not create data directory:', e.message);
}

const getDefaultData = () => ({
  admin: {
    _id: 'mem-admin-01',
    name: 'Pandurang Patil (Manager)',
    email: 'admin@yashwantfarm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'admin',
    lastLogin: new Date().toISOString()
  },
  settings: {
    _id: 'mem-settings-01',
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
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000',
    updatedAt: new Date().toISOString()
  },
  prices: [
    {
      _id: 'price-weekday-01',
      title: 'Weekday Stay',
      category: 'Monday - Thursday',
      amount: 8500,
      unit: 'per night',
      description: 'Peaceful escape for families and friends. Enjoy full private farmhouse access.',
      features: [
        'Entire Private Farmhouse & Grounds',
        'Full Swimming Pool Access',
        'Equipped Kitchen & Cooking Facility',
        'Accommodates up to 10 Guests',
        'Spacious Vehicle Parking',
        'Peaceful Natural Countryside'
      ],
      badge: 'Calm Retreat',
      active: true,
      order: 1
    },
    {
      _id: 'price-weekend-02',
      title: 'Weekend Stay',
      category: 'Friday - Sunday',
      amount: 11000,
      unit: 'per night',
      description: 'Prime weekend getaway. Perfect for reconnecting with family and friends.',
      features: [
        'Entire Private Farmhouse & Grounds',
        'Full Swimming Pool Access',
        'Equipped Kitchen & Cooking Facility',
        'Accommodates up to 10 Guests',
        'Spacious Vehicle Parking',
        'Evening Lawn Gathering Space'
      ],
      badge: 'Most Popular',
      active: true,
      order: 2
    },
    {
      _id: 'price-dayouting-03',
      title: 'Day Outing / Picnic',
      category: 'Day Visit (10 AM - 6 PM)',
      amount: 5500,
      unit: 'day pass',
      description: 'Relaxing day getaway with friends or family without overnight stay.',
      features: [
        'Swimming Pool Access all day',
        'Open Lawn & Shaded Veranda',
        'Cooking & Dining Facility',
        'Up to 10 Visitors included',
        'Changing Rooms & Washrooms',
        'Secure On-site Parking'
      ],
      badge: 'Day Pass',
      active: true,
      order: 3
    },
    {
      _id: 'price-extraguest-04',
      title: 'Extra Guest',
      category: 'Per Person',
      amount: 500,
      unit: 'per person',
      description: 'For groups larger than 10 people. Extra mattress and facility access provided.',
      features: [
        'Additional Bedding & Linen',
        'Full Access to All Amenities',
        'Children under 5 stay free'
      ],
      badge: '',
      active: true,
      order: 4
    }
  ],
  availability: {},
  gallery: [
    {
      _id: 'gal-exterior-01',
      imageUrl: '/images/farmhouse-exterior-2.jpg',
      imageName: 'farmhouse-exterior-2.jpg',
      altText: 'Yashwant Farmhouse — full property view with swimming pool and lush greenery',
      featured: true,
      category: 'Property',
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'gal-cottage-02',
      imageUrl: '/images/farmhouse-exterior-1.jpg',
      imageName: 'farmhouse-exterior-1.jpg',
      altText: 'Yashwant Farmhouse — red-brick cottage with traditional tiled roof and pool',
      featured: false,
      category: 'Architecture',
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'gal-pool-03',
      imageUrl: '/images/farmhouse-pool-view.jpg',
      imageName: 'farmhouse-pool-view.jpg',
      altText: 'Private swimming pool at Yashwant Farmhouse with surrounding countryside',
      featured: false,
      category: 'Pool',
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'gal-logo-04',
      imageUrl: '/images/farmhouse-logo.jpg',
      imageName: 'farmhouse-logo.jpg',
      altText: 'Yashwant Farmhouse branding — यशवंत फार्महाऊस Nandwal, Kolhapur',
      featured: false,
      category: 'Brand',
      order: 4,
      createdAt: new Date().toISOString()
    }
  ],
  enquiries: []
});

class PersistentStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          return {
            ...getDefaultData(),
            ...parsed,
            admin: { ...getDefaultData().admin, ...(parsed.admin || {}) },
            settings: { ...getDefaultData().settings, ...(parsed.settings || {}) },
            prices: Array.isArray(parsed.prices) && parsed.prices.length > 0 ? parsed.prices : getDefaultData().prices,
            availability: parsed.availability || {},
            gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : getDefaultData().gallery,
            enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : []
          };
        }
      }
    } catch (e) {
      console.warn('[PersistentStore] Error loading DB_FILE, creating fresh store:', e.message);
    }

    const initial = getDefaultData();
    this.saveDataDirect(initial);
    return initial;
  }

  save() {
    this.saveDataDirect(this.data);
  }

  saveDataDirect(dataToSave) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
      } catch (innerErr) {
        console.error('[PersistentStore] Failed to write to disk:', innerErr.message);
      }
    }
  }

  // Admin
  getAdminByEmail(email) {
    if (!email) return null;
    if (this.data.admin.email.toLowerCase() === email.toLowerCase().trim()) {
      return this.data.admin;
    }
    return null;
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newData) {
    this.data.settings = {
      ...this.data.settings,
      ...newData,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.settings;
  }

  // Prices
  getPrices() {
    return this.data.prices;
  }

  addPrice(priceData) {
    const newPrice = {
      _id: `price-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: (this.data.prices.length || 0) + 1,
      active: true,
      ...priceData
    };
    this.data.prices.push(newPrice);
    this.save();
    return newPrice;
  }

  updatePrice(id, priceData) {
    const idx = this.data.prices.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      this.data.prices[idx] = { ...this.data.prices[idx], ...priceData };
      this.save();
      return this.data.prices[idx];
    }
    // Also try matching by title
    if (priceData.title) {
      const titleIdx = this.data.prices.findIndex(p => p.title.toLowerCase() === priceData.title.toLowerCase());
      if (titleIdx !== -1) {
        this.data.prices[titleIdx] = { ...this.data.prices[titleIdx], ...priceData };
        this.save();
        return this.data.prices[titleIdx];
      }
    }
    return null;
  }

  togglePrice(id) {
    const idx = this.data.prices.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      this.data.prices[idx].active = !this.data.prices[idx].active;
      this.save();
      return this.data.prices[idx];
    }
    return null;
  }

  deletePrice(id) {
    const idx = this.data.prices.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      const removed = this.data.prices.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Availability
  getAvailability() {
    return this.data.availability || {};
  }

  setAvailability(date, status, notes = '', guestCount = 0) {
    if (!this.data.availability) this.data.availability = {};
    this.data.availability[date] = {
      status,
      notes: notes || '',
      guestCount: Number(guestCount) || 0,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.availability[date];
  }

  batchSetAvailability(dates, status, notes = '') {
    if (!this.data.availability) this.data.availability = {};
    dates.forEach(d => {
      this.data.availability[d] = {
        status,
        notes: notes || '',
        guestCount: 0,
        updatedAt: new Date().toISOString()
      };
    });
    this.save();
    return true;
  }

  deleteAvailability(date) {
    if (this.data.availability && this.data.availability[date]) {
      delete this.data.availability[date];
      this.save();
    }
    return true;
  }

  // Gallery
  getGallery() {
    return this.data.gallery || [];
  }

  addGalleryPhoto(photoData) {
    if (!this.data.gallery) this.data.gallery = [];
    const newPhoto = {
      _id: `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: this.data.gallery.length + 1,
      createdAt: new Date().toISOString(),
      ...photoData
    };
    this.data.gallery.unshift(newPhoto);
    this.save();
    return newPhoto;
  }

  toggleFeatured(id) {
    const idx = this.data.gallery.findIndex(g => String(g._id) === String(id));
    if (idx !== -1) {
      this.data.gallery[idx].featured = !this.data.gallery[idx].featured;
      this.save();
      return this.data.gallery[idx];
    }
    return null;
  }

  deleteGalleryPhoto(id) {
    const idx = this.data.gallery.findIndex(g => String(g._id) === String(id));
    if (idx !== -1) {
      const removed = this.data.gallery.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Enquiries
  getEnquiries() {
    return this.data.enquiries || [];
  }

  addEnquiry(data) {
    if (!this.data.enquiries) this.data.enquiries = [];
    const enquiry = {
      _id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      ...data
    };
    this.data.enquiries.unshift(enquiry);
    this.save();
    return enquiry;
  }

  updateEnquiryStatus(id, status) {
    const idx = this.data.enquiries.findIndex(e => String(e._id) === String(id));
    if (idx !== -1) {
      this.data.enquiries[idx].status = status;
      this.save();
      return this.data.enquiries[idx];
    }
    return null;
  }

  deleteEnquiry(id) {
    const idx = this.data.enquiries.findIndex(e => String(e._id) === String(id));
    if (idx !== -1) {
      const removed = this.data.enquiries.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }
}

export const persistentStore = new PersistentStore();
export const memoryStore = persistentStore; // Backwards compatible alias
export default persistentStore;
