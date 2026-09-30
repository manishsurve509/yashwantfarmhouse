import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function FloatingWhatsApp() {
  const { settings } = useSiteData();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNumber = settings?.whatsappNumber || '918010042002';
  const message = encodeURIComponent('Hello, I would like to enquire about Yashwant Farm.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      
      {/* Tooltip Prompt */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#163624] px-4 py-2 rounded-2xl shadow-xl border border-[#E5DFD7] text-xs font-semibold animate-fade-in">
          <span>Need help or date check?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-700 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      >
        <MessageSquare className="w-7 h-7" />

        {/* Pulsing Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        {/* Small Active Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-300 border-2 border-white" />
      </a>

    </div>
  );
}
