import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeFetch } from '../utils/api';

const SiteContext = createContext();

const SITE_CACHE_KEY = 'yashwant_farm_current_site_data';

const getInitialSiteData = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(SITE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return {
            settings: parsed.settings || null,
            prices: Array.isArray(parsed.prices) ? parsed.prices : [],
            availability: parsed.availability || {},
            gallery: Array.isArray(parsed.gallery) ? parsed.gallery : []
          };
        }
      }
    } catch (_) {}
  }
  return {
    settings: null,
    prices: [],
    availability: {},
    gallery: []
  };
};

export const SiteProvider = ({ children }) => {
  const [data, setData] = useState(getInitialSiteData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await safeFetch('/api/public/data');
      
      if (res.ok && res.data && res.data.success && res.data.data) {
        const serverData = res.data.data;
        const currentData = {
          settings: serverData.settings || null,
          prices: Array.isArray(serverData.prices) ? serverData.prices : [],
          availability: serverData.availability || {},
          gallery: Array.isArray(serverData.gallery) ? serverData.gallery : []
        };

        setData(currentData);
        setError(null);

        try {
          localStorage.setItem(SITE_CACHE_KEY, JSON.stringify(currentData));
        } catch (_) {}
      } else {
        console.warn('[SiteData] Backend response issue:', res.error);
        setError(res.error);
      }
    } catch (err) {
      console.warn('[SiteData] Fetch error:', err.message);
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
