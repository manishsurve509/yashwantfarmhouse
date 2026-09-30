import bcrypt from 'bcryptjs';

// Pre-computed bcrypt hash for 'Admin@Yashwant2026'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Admin@Yashwant2026', 10);

class MemoryStore {
  constructor() {
    this.admin = {
      _id: 'mem-admin-01',
      name: 'Yashwant Farm Manager',
      email: 'admin@yashwantfarm.com',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'admin',
      lastLogin: new Date()
    };

    this.settings = {
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
      updatedAt: new Date()
    };

    this.prices = [
      {
        _id: 'mem-price-1',
        title: 'Weekday Stay',
        category: 'Monday - Thursday',
        amount: 4500,
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
        _id: 'mem-price-2',
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
        _id: 'mem-price-3',
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
        _id: 'mem-price-4',
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
    ];

    this.availability = {
      '2026-10-01': { status: 'booked', notes: 'Advance booking', guestCount: 8 },
      '2026-10-02': { status: 'booked', notes: 'Weekend group', guestCount: 10 },
      '2026-10-03': { status: 'booked', notes: 'Weekend group', guestCount: 10 },
      '2026-10-09': { status: 'booked', notes: 'Family outing', guestCount: 6 },
      '2026-10-10': { status: 'booked', notes: 'Weekend stay', guestCount: 10 },
      '2026-10-16': { status: 'booked', notes: 'Corporate team', guestCount: 12 },
      '2026-10-23': { status: 'unavailable', notes: 'Property maintenance', guestCount: 0 }
    };

    this.gallery = [
      {
        _id: 'mem-gal-1',
        imageUrl: '/images/farmhouse-exterior-2.jpg',
        imageName: 'farmhouse-exterior-2.jpg',
        altText: 'Yashwant Farmhouse — full property view with swimming pool and lush greenery',
        featured: true,
        category: 'Property',
        order: 1
      },
      {
        _id: 'mem-gal-2',
        imageUrl: '/images/farmhouse-exterior-1.jpg',
        imageName: 'farmhouse-exterior-1.jpg',
        altText: 'Yashwant Farmhouse — red-brick cottage with traditional tiled roof and pool',
        featured: false,
        category: 'Architecture',
        order: 2
      },
      {
        _id: 'mem-gal-3',
        imageUrl: '/images/farmhouse-pool-view.jpg',
        imageName: 'farmhouse-pool-view.jpg',
        altText: 'Private swimming pool at Yashwant Farmhouse with surrounding countryside',
        featured: false,
        category: 'Pool',
        order: 3
      },
      {
        _id: 'mem-gal-4',
        imageUrl: '/images/farmhouse-logo.jpg',
        imageName: 'farmhouse-logo.jpg',
        altText: 'Yashwant Farmhouse branding — यशवंत फार्महाऊस Nandwal, Kolhapur',
        featured: false,
        category: 'Brand',
        order: 4
      }
    ];

    this.enquiries = [
      {
        _id: 'mem-enq-1',
        name: 'Rahul Deshmukh',
        phone: '9822012345',
        email: 'rahul.deshmukh@example.com',
        preferredDate: '2026-10-12',
        guests: '8-10',
        message: 'Looking for a peaceful family weekend stay with pool access.',
        status: 'new',
        createdAt: new Date()
      }
    ];
  }

  // Admin
  getAdminByEmail(email) {
    if (this.admin.email.toLowerCase() === email.toLowerCase().trim()) {
      return this.admin;
    }
    return null;
  }

  // Settings
  getSettings() {
    return this.settings;
  }

  updateSettings(data) {
    this.settings = { ...this.settings, ...data, updatedAt: new Date() };
    return this.settings;
  }

  // Prices
  getPrices() {
    return this.prices;
  }

  addPrice(priceData) {
    const newPrice = {
      _id: `mem-price-${Date.now()}`,
      order: this.prices.length + 1,
      active: true,
      ...priceData
    };
    this.prices.push(newPrice);
    return newPrice;
  }

  updatePrice(id, priceData) {
    const idx = this.prices.findIndex(p => p._id === id);
    if (idx !== -1) {
      this.prices[idx] = { ...this.prices[idx], ...priceData };
      return this.prices[idx];
    }
    return null;
  }

  togglePrice(id) {
    const idx = this.prices.findIndex(p => p._id === id);
    if (idx !== -1) {
      this.prices[idx].active = !this.prices[idx].active;
      return this.prices[idx];
    }
    return null;
  }

  deletePrice(id) {
    const idx = this.prices.findIndex(p => p._id === id);
    if (idx !== -1) {
      return this.prices.splice(idx, 1)[0];
    }
    return null;
  }

  // Availability
  getAvailability() {
    return this.availability;
  }

  setAvailability(date, status, notes = '', guestCount = 0) {
    this.availability[date] = { status, notes, guestCount };
    return this.availability[date];
  }

  batchSetAvailability(dates, status, notes = '') {
    dates.forEach(d => {
      this.availability[d] = { status, notes, guestCount: 0 };
    });
    return true;
  }

  deleteAvailability(date) {
    delete this.availability[date];
    return true;
  }

  // Gallery
  getGallery() {
    return this.gallery;
  }

  addGalleryPhoto(photoData) {
    const newPhoto = {
      _id: `mem-gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: this.gallery.length + 1,
      createdAt: new Date(),
      ...photoData
    };
    this.gallery.unshift(newPhoto);
    return newPhoto;
  }

  toggleFeatured(id) {
    const idx = this.gallery.findIndex(g => g._id === id);
    if (idx !== -1) {
      this.gallery[idx].featured = !this.gallery[idx].featured;
      return this.gallery[idx];
    }
    return null;
  }

  deleteGalleryPhoto(id) {
    const idx = this.gallery.findIndex(g => g._id === id);
    if (idx !== -1) {
      return this.gallery.splice(idx, 1)[0];
    }
    return null;
  }

  // Enquiries
  getEnquiries() {
    return this.enquiries;
  }

  addEnquiry(data) {
    const enquiry = {
      _id: `mem-enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date(),
      ...data
    };
    this.enquiries.unshift(enquiry);
    return enquiry;
  }

  updateEnquiryStatus(id, status) {
    const idx = this.enquiries.findIndex(e => e._id === id);
    if (idx !== -1) {
      this.enquiries[idx].status = status;
      return this.enquiries[idx];
    }
    return null;
  }

  deleteEnquiry(id) {
    const idx = this.enquiries.findIndex(e => e._id === id);
    if (idx !== -1) {
      return this.enquiries.splice(idx, 1)[0];
    }
    return null;
  }
}

export const memoryStore = new MemoryStore();
