import React from 'react';
import { Calendar, MessageSquare, MapPin, ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Hero({ onCheckAvailability }) {
  const { settings } = useSiteData();

  const handleScroll = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      const topOffset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPos = elPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      
      {/* Background Image with Authentic High-Resolution Farmhouse Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/farmhouse-exterior-2.jpg"
          alt="Yashwant Farmhouse, Nandwal, Kolhapur"
          className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Subtle Luxury Dark Forest Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102419]/95 via-[#163624]/75 to-[#163624]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4 sm:px-6">
        
        {/* Location Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#EDE6DC] text-xs sm:text-sm font-medium mb-6 animate-fade-in shadow-inner">
          <MapPin className="w-3.5 h-3.5 text-[#C69A52]" />
          <span>📍 Nandwal, Kolhapur</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C69A52] inline-block ml-1"></span>
          <span className="text-white/80">Maharashtra</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF8F5] mb-5 leading-[1.1] drop-shadow-md">
          {settings?.farmhouseName || 'Yashwant Farm'}
        </h1>

        {/* Marathi Subtitle */}
        <p className="text-sm sm:text-base font-serif text-[#C69A52] tracking-wider mb-4 opacity-90">
          यशवंत फार्महाऊस • शांतता आणि निसर्गाचा सुंदर अनुभव
        </p>

        {/* Tagline / Subheading */}
        <p className="text-base sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed font-sans drop-shadow">
          A peaceful farmhouse getaway in Nandwal, Kolhapur.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 max-w-md mx-auto">
          
          <button
            onClick={() => handleScroll('#availability')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#163624] font-semibold text-sm tracking-wide shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#163624]" />
            <span>Check Availability</span>
          </button>

          <a
            href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Yashwant%20Farm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-sm tracking-wide shadow-lg hover:bg-[#20ba5a] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>

        </div>

        {/* Quick Trust Badges */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#C69A52]" />
            <span>Private Swimming Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C69A52] font-bold">🏡</span>
            <span>Independent Brick Villa</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C69A52]" />
            <span>100% Group Privacy</span>
          </div>
        </div>

      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors cursor-pointer" onClick={() => handleScroll('#quick-info')}>
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#C69A52] rounded-full animate-bounce"></div>
        </div>
      </div>

    </section>
  );
}
