import React from 'react';
import {
  Calendar,
  IndianRupee,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  Users,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function AdminDashboard({ onNavigateTab, onNavigateWebsite }) {
  const { settings, prices, availability, gallery } = useSiteData();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Admin 👋';
    if (hour < 17) return 'Good Afternoon, Admin 👋';
    return 'Good Evening, Admin 👋';
  };

  // Compute stat metrics
  const activePrices = prices?.filter(p => p.active !== false) || [];
  const lowestPrice = activePrices.length > 0 ? Math.min(...activePrices.map(p => p.amount)) : 8500;
  const highestPrice = activePrices.length > 0 ? Math.max(...activePrices.map(p => p.amount)) : 11000;

  const bookedDatesCount = Object.values(availability || {}).filter(status => status === 'booked').length;
  const photoCount = gallery?.length || 4;
  const featuredPhotoCount = gallery?.filter(p => p.featured)?.length || 1;

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Greeting Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#163624]">
          {getGreeting()}
        </h1>
        <p className="text-sm sm:text-base text-[#6B726D] mt-1">
          Manage your Yashwant Farm from one place.
        </p>
      </div>

      {/* 4 Individual Modern Metric Cards (NOT long horizontal boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Farmhouse Status */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow card-shadow-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796E64]">
                Farmhouse Status
              </span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 inline-block"></span>
            </div>
            <p className="font-serif text-2xl font-bold text-[#163624] mb-1">
              Live & Open
            </p>
            <p className="text-xs text-[#6B726D]">
              Accepting bookings and guest visits
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-[#F3EFE9] flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Public Website Active</span>
          </div>
        </div>

        {/* Card 2: Current Price */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow card-shadow-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796E64]">
                Current Rates
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E7EFEA] flex items-center justify-center text-[#163624]">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-[#163624] mb-1">
              {formatCurrency(lowestPrice)} – {formatCurrency(highestPrice)}
            </p>
            <p className="text-xs text-[#6B726D]">
              {activePrices.length} active pricing tiers configured
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('prices')}
            className="pt-4 mt-2 border-t border-[#F3EFE9] flex items-center justify-between text-xs font-semibold text-[#163624] hover:text-[#C69A52] transition-colors"
          >
            <span>Edit pricing</span>
            <span>→</span>
          </button>
        </div>

        {/* Card 3: Upcoming Bookings */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow card-shadow-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796E64]">
                Upcoming Bookings
              </span>
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-[#163624] mb-1">
              {bookedDatesCount} Booked Dates
            </p>
            <p className="text-xs text-[#6B726D]">
              Reserved on the live calendar
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('availability')}
            className="pt-4 mt-2 border-t border-[#F3EFE9] flex items-center justify-between text-xs font-semibold text-[#163624] hover:text-[#C69A52] transition-colors"
          >
            <span>View calendar</span>
            <span>→</span>
          </button>
        </div>

        {/* Card 4: Gallery Photos */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow card-shadow-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796E64]">
                Gallery Photos
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E7EFEA] flex items-center justify-center text-[#163624]">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-[#163624] mb-1">
              {photoCount} Images
            </p>
            <p className="text-xs text-[#6B726D]">
              {featuredPhotoCount} featured on homepage hero
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('gallery')}
            className="pt-4 mt-2 border-t border-[#F3EFE9] flex items-center justify-between text-xs font-semibold text-[#163624] hover:text-[#C69A52] transition-colors"
          >
            <span>Manage photos</span>
            <span>→</span>
          </button>
        </div>

      </div>

      {/* Admin Hero Welcome Card (Farmhouse image based) */}
      <div className="relative rounded-3xl overflow-hidden card-shadow border border-[#E5DFD7] min-h-[220px] flex items-center">
        <img
          src="/images/farmhouse-exterior-2.jpg"
          alt="Yashwant Farmhouse Nandwal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102419]/95 via-[#163624]/85 to-[#163624]/70" />

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FAF8F5] text-xs font-semibold border border-white/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span>● Website Live</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
              {settings?.farmhouseName || 'Yashwant Farm'}
            </h2>
            <p className="text-xs sm:text-sm text-[#C69A52] font-medium mb-3">
              📍 {settings?.locationShort || 'Nandwal, Kolhapur'}
            </p>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
              Manage availability, pricing and gallery. Any update made here immediately syncs with your public website in real-time.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={onNavigateWebsite}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF8F5] text-[#163624] font-semibold text-xs uppercase tracking-wider hover:bg-white shadow transition-all"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#163624]" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions (4 Visually Attractive Cards) */}
      <div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163624] mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Add Availability */}
          <button
            onClick={() => onNavigateTab('availability')}
            className="p-5 rounded-2xl bg-white border border-[#E5DFD7] hover:border-[#163624] card-shadow card-shadow-hover text-left flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-[#163624] group-hover:text-white transition-colors">
              +
            </div>
            <div>
              <span className="text-xs text-[#796E64] uppercase font-semibold block">Calendar</span>
              <span className="font-serif text-base font-bold text-[#163624] block">Add Availability</span>
            </div>
          </button>

          {/* Action 2: Update Price */}
          <button
            onClick={() => onNavigateTab('prices')}
            className="p-5 rounded-2xl bg-white border border-[#E5DFD7] hover:border-[#163624] card-shadow card-shadow-hover text-left flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg group-hover:bg-[#163624] group-hover:text-white transition-colors">
              ₹
            </div>
            <div>
              <span className="text-xs text-[#796E64] uppercase font-semibold block">Tariff</span>
              <span className="font-serif text-base font-bold text-[#163624] block">Update Price</span>
            </div>
          </button>

          {/* Action 3: Upload Photo */}
          <button
            onClick={() => onNavigateTab('gallery')}
            className="p-5 rounded-2xl bg-white border border-[#E5DFD7] hover:border-[#163624] card-shadow card-shadow-hover text-left flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl group-hover:bg-[#163624] group-hover:text-white transition-colors">
              +
            </div>
            <div>
              <span className="text-xs text-[#796E64] uppercase font-semibold block">Photos</span>
              <span className="font-serif text-base font-bold text-[#163624] block">Upload Photo</span>
            </div>
          </button>

          {/* Action 4: View Website */}
          <button
            onClick={onNavigateWebsite}
            className="p-5 rounded-2xl bg-white border border-[#E5DFD7] hover:border-[#163624] card-shadow card-shadow-hover text-left flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center font-bold text-lg group-hover:bg-[#163624] group-hover:text-white transition-colors">
              🌐
            </div>
            <div>
              <span className="text-xs text-[#796E64] uppercase font-semibold block">Customer View</span>
              <span className="font-serif text-base font-bold text-[#163624] block">View Website</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
