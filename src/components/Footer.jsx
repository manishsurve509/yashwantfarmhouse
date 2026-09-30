import React from 'react';
import { Shield, Heart, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Footer({ onNavigateAdmin }) {
  const { settings } = useSiteData();

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const topOffset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPos = elPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#102419] text-[#FAF8F5] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#163624] flex items-center justify-center text-[#C69A52] font-serif font-bold text-xl border border-[#C69A52]/30">
                Y
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-white block uppercase">
                  {settings?.farmhouseName || 'Yashwant Farm'}
                </span>
                <span className="text-[11px] font-medium text-[#C69A52] tracking-widest block uppercase">
                  {settings?.nameMarathi || 'यशवंत फार्महाऊस'}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm font-light">
              A peaceful farmhouse getaway in Nandwal, Kolhapur surrounded by nature. Swimming pool, comfortable stay, cooking facility & parking.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#C69A52] pt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Nandwal, Kolhapur, Maharashtra</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#C69A52] mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {['#home', '#about', '#gallery', '#pricing', '#availability', '#contact'].map((href) => {
                const label = href.replace('#', '').charAt(0).toUpperCase() + href.replace('#', '').slice(1);
                return (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => handleLinkClick(e, href)}
                      className="hover:text-[#C69A52] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#C69A52]/50 text-xs">›</span>
                      <span>{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Farm Facilities */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#C69A52] mb-4 uppercase tracking-wider text-xs">
              Farmhouse Highlights
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>• Private Freshwater Swimming Pool</li>
              <li>• Red-Brick Countryside Cottage</li>
              <li>• Self-Cooking & Kitchen Facility</li>
              <li>• Spacious Vehicle Parking on Premises</li>
              <li>• 100% Private Booking For Single Group</li>
              <li>• Family and Friends Outings</li>
            </ul>
          </div>

          {/* Direct Host Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#C69A52] mb-4 uppercase tracking-wider text-xs">
              Host Contact
            </h4>
            <div className="space-y-3 text-xs text-white/80">
              <p>
                <span className="text-white/50 block">Manager:</span>
                <span className="font-semibold text-white">{settings?.owner || 'Pandurang Yashwant Patil'}</span>
              </p>
              <p>
                <span className="text-white/50 block">Phone:</span>
                <a href={`tel:${settings?.phonePrimary || '+918010042002'}`} className="hover:text-[#C69A52] font-medium">
                  {settings?.phonePrimaryDisplay || '80100 42002'} / {settings?.phoneSecondaryDisplay || '99759 19947'}
                </a>
              </p>
              <p>
                <span className="text-white/50 block">WhatsApp:</span>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-medium"
                >
                  +{settings?.whatsappNumber || '918010042002'}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Management Portal link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Yashwant Farm. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 text-white/50 hover:text-[#C69A52] transition-colors text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Manager Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
