import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useSiteData } from './context/SiteContext';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickInfo from './components/QuickInfo';
import About from './components/About';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import BookingEnquiry from './components/BookingEnquiry';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminAvailability from './admin/AdminAvailability';
import AdminPrices from './admin/AdminPrices';
import AdminGallery from './admin/AdminGallery';
import AdminSettings from './admin/AdminSettings';
import AdminEnquiries from './admin/AdminEnquiries';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading: siteLoading } = useSiteData();

  // Route state: 'public' | 'admin-login' | 'admin-dashboard'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin/login')) return 'admin-login';
    if (path.startsWith('/admin')) return 'admin-dashboard';
    return 'public';
  });

  // Admin active tab
  const [adminTab, setAdminTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('availability')) return 'availability';
    if (path.includes('prices')) return 'prices';
    if (path.includes('gallery')) return 'gallery';
    if (path.includes('settings')) return 'settings';
    if (path.includes('enquiries')) return 'enquiries';
    return 'dashboard';
  });

  const [prefilledDate, setPrefilledDate] = useState('');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin/login')) {
        setCurrentRoute('admin-login');
      } else if (path.startsWith('/admin')) {
        setCurrentRoute('admin-dashboard');
      } else {
        setCurrentRoute('public');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route, tab = 'dashboard') => {
    setCurrentRoute(route);
    setAdminTab(tab);
    let path = '/';
    if (route === 'admin-login') path = '/admin/login';
    if (route === 'admin-dashboard') path = `/admin/${tab}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDateFromCalendar = (dateKey, status) => {
    if (status === 'available') {
      setPrefilledDate(dateKey);
      const el = document.querySelector('#enquiry');
      if (el) {
        const topOffset = 80;
        const elPos = el.getBoundingClientRect().top;
        const offsetPos = elPos + window.pageYOffset - topOffset;
        window.scrollTo({ top: offsetPos, behavior: 'smooth' });
      }
    }
  };

  // Route Guard: If in admin-dashboard and NOT authenticated, redirect to admin-login
  if (!authLoading && currentRoute === 'admin-dashboard' && !isAuthenticated) {
    return (
      <AdminLogin
        onBackToWebsite={() => navigateTo('public')}
        onLoginSuccess={() => navigateTo('admin-dashboard', 'dashboard')}
      />
    );
  }

  // Admin Login Route
  if (currentRoute === 'admin-login') {
    if (isAuthenticated) {
      // If already logged in, show dashboard
      return (
        <AdminLayout
          activeTab={adminTab}
          setActiveTab={(tab) => navigateTo('admin-dashboard', tab)}
          onNavigateWebsite={() => navigateTo('public')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              onNavigateTab={(t) => setAdminTab(t)}
              onNavigateWebsite={() => navigateTo('public')}
            />
          )}
          {adminTab === 'availability' && <AdminAvailability />}
          {adminTab === 'prices' && <AdminPrices />}
          {adminTab === 'gallery' && <AdminGallery />}
          {adminTab === 'settings' && <AdminSettings />}
          {adminTab === 'enquiries' && <AdminEnquiries />}
        </AdminLayout>
      );
    }

    return (
      <AdminLogin
        onBackToWebsite={() => navigateTo('public')}
        onLoginSuccess={() => navigateTo('admin-dashboard', 'dashboard')}
      />
    );
  }

  // Admin Dashboard Route
  if (currentRoute === 'admin-dashboard' && isAuthenticated) {
    return (
      <AdminLayout
        activeTab={adminTab}
        setActiveTab={(tab) => navigateTo('admin-dashboard', tab)}
        onNavigateWebsite={() => navigateTo('public')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={(t) => setAdminTab(t)}
            onNavigateWebsite={() => navigateTo('public')}
          />
        )}
        {adminTab === 'availability' && <AdminAvailability />}
        {adminTab === 'prices' && <AdminPrices />}
        {adminTab === 'gallery' && <AdminGallery />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'enquiries' && <AdminEnquiries />}
      </AdminLayout>
    );
  }

  // Default: Public Website Experience
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222B24] flex flex-col font-sans">
      <Navbar onNavigateAdmin={() => navigateTo('admin-login')} />
      
      <main className="flex-grow">
        <Hero onCheckAvailability={() => {
          const el = document.querySelector('#availability');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />
        <QuickInfo />
        <About />
        <Amenities />
        <Gallery />
        <Pricing onSelectPricing={() => {
          const el = document.querySelector('#availability');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />
        <AvailabilityCalendar onSelectDate={handleSelectDateFromCalendar} />
        <BookingEnquiry prefilledDate={prefilledDate} />
        <Location />
        <Contact />
      </main>

      <Footer onNavigateAdmin={() => navigateTo('admin-login')} />
      <FloatingWhatsApp />
    </div>
  );
}
