import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Shield, CalendarCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Navbar({ onNavigateAdmin }) {
  const { settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Availability', href: '#availability' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav-scrolled py-3' : 'glass-nav py-4 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#163624] flex items-center justify-center text-[#C69A52] font-serif font-bold text-xl shadow-md border border-[#C69A52]/30 group-hover:scale-105 transition-transform">
              Y
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#163624] block uppercase">
                {settings?.farmhouseName || 'Yashwant Farm'}
              </span>
              <span className="text-[10px] tracking-widest text-[#796E64] font-medium block uppercase -mt-0.5">
                Nandwal • Kolhapur
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-[#2E3630]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#1F4A32] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C69A52] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=Hello%20Yashwant%20Farm%2C%20I%20would%20like%20to%20enquire%20about%20staying%20at%20your%20farmhouse.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#163624] bg-[#E7EFEA] hover:bg-[#d8e6dd] rounded-full transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1F4A32]" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#enquiry"
              onClick={(e) => handleLinkClick(e, '#enquiry')}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#163624] hover:bg-[#102419] rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#C69A52]" />
              <span>Book / Enquire</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#enquiry"
              onClick={(e) => handleLinkClick(e, '#enquiry')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#163624] rounded-full"
            >
              Enquire
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#163624] hover:bg-[#E7EFEA] focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E5DFD7] px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#222B24] hover:bg-[#E7EFEA] hover:text-[#163624] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5DFD7] flex flex-col gap-2.5">
            <a
              href={`tel:${settings?.phonePrimary || '+918010042002'}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-[#E7EFEA] text-[#163624]"
            >
              <Phone className="w-4 h-4 text-[#1F4A32]" />
              <span>Call: {settings?.phonePrimaryDisplay || '80100 42002'}</span>
            </a>

            <a
              href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=Hello%20Yashwant%20Farm%2C%20I%20would%20like%20to%20enquire%20about%20staying%20at%20your%20farmhouse.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-[#25D366] text-white shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateAdmin();
              }}
              className="flex items-center justify-center gap-1.5 text-xs text-[#796E64] hover:text-[#163624] py-1 pt-2 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
