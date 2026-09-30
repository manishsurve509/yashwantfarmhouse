import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeFetch } from '../utils/api';

const SiteContext = createContext();

const defaultSiteData = {
  settings: {
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
    locationFull: 'Nandwal, Kolhapur, Maharashtra, India',
    locationShort: 'Nandwal, Kolhapur',
    mapsUrl: 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000'
  },
  prices: [
    {
      _id: 'default-price-1',
      title: 'Weekday Stay',
      category: 'Monday - Thursday',
      amount: 8500,
      unit: 'per night',
      badge: 'Calm Retreat',
      description: 'Peaceful countryside escape for families and friends. Enjoy full private farmhouse access.',
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
      _id: 'default-price-2',
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
      _id: 'default-price-3',
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
    }
  ],
  availability: {},
  gallery: [
    {
      _id: 'default-gallery-1',
      imageUrl: '/images/farmhouse-exterior-2.jpg',
      imageName: 'farmhouse-exterior-2.jpg',
      altText: 'Yashwant Farmhouse — full property view with swimming pool and lush greenery',
      featured: true,
      category: 'Property'
    },
    {
      _id: 'default-gallery-2',
      imageUrl: '/images/farmhouse-exterior-1.jpg',
      imageName: 'farmhouse-exterior-1.jpg',
      altText: 'Yashwant Farmhouse — red-brick cottage with traditional tiled roof and pool',
      featured: false,
      category: 'Property'
    },
    {
      _id: 'default-gallery-3',
      imageUrl: '/images/farmhouse-pool-view.jpg',
      imageName: 'farmhouse-pool-view.jpg',
      altText: 'Private swimming pool at Yashwant Farmhouse with surrounding countryside',
      featured: false,
      category: 'Pool'
    },
    {
      _id: 'default-gallery-4',
      imageUrl: '/images/farmhouse-logo.jpg',
      imageName: 'farmhouse-logo.jpg',
      altText: 'Yashwant Farmhouse branding — यशवंत फार्महाऊस Nandwal, Kolhapur',
      featured: false,
      category: 'Brand'
    }
  ]
};

export const SiteProvider = ({ children }) => {
  const [data, setData] = useState(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await safeFetch('/api/public/data');
      
      if (res.ok && res.data && res.data.success && res.data.data) {
        setData({
          settings: res.data.data.settings || defaultSiteData.settings,
          prices: res.data.data.prices?.length ? res.data.data.prices : defaultSiteData.prices,
          availability: res.data.data.availability || {},
          gallery: res.data.data.gallery?.length ? res.data.data.gallery : defaultSiteData.gallery
        });
        setError(null);
      } else {
        // Safe fallback without throwing syntax errors
        console.warn('[SiteData] Backend offline or returned non-JSON:', res.error);
        setError(res.error);
      }
    } catch (err) {
      console.warn('[SiteData] Using defaults:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitEnquiry = async (formData) => {
    const res = await safeFetch('/api/public/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok || !res.data?.success) {
      throw new Error(res.error || res.data?.message || 'Error submitting enquiry');
    }
    return res.data;
  };

  return (
    <SiteContext.Provider value={{
      ...data,
      loading,
      error,
      refreshData: fetchData,
      submitEnquiry
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteContext);
