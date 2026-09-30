import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [data, setData] = useState({
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
    prices: [],
    availability: {},
    gallery: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/data');
      if (!res.ok) throw new Error('Failed to fetch site data');
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.warn('Using default site data due to fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitEnquiry = async (formData) => {
    const res = await fetch('/api/public/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Error submitting enquiry');
    }
    return result;
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
