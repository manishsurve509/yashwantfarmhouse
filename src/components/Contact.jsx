import React from 'react';
import { Phone, MessageSquare, MapPin, User, Navigation, Clock, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Contact() {
  const { settings } = useSiteData();

  const phonePrimary = settings?.phonePrimary || '+918010042002';
  const phonePrimaryDisplay = settings?.phonePrimaryDisplay || '80100 42002';
  const phoneSecondary = settings?.phoneSecondary || '+919975919947';
  const phoneSecondaryDisplay = settings?.phoneSecondaryDisplay || '99759 19947';
  const whatsappNumber = settings?.whatsappNumber || '918010042002';
  const directionsUrl = settings?.mapsUrl || 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw';

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F3EFE9]/50 border-t border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Get in Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Contact Yashwant Farm
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">📞</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Reach out directly for booking inquiries, rates, and customized stay planning.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
          
          {/* Card 1: Phone */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5DFD7] card-shadow card-shadow-hover text-center flex flex-col justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center mb-5">
              <Phone className="w-6 h-6 text-[#1F4A32]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-1">
                Direct Call
              </span>
              <h3 className="font-serif text-xl font-bold text-[#163624] mb-2">
                Phone Enquiries
              </h3>
              <p className="text-base font-bold text-[#163624] mb-1">
                {phonePrimaryDisplay}
              </p>
              <p className="text-sm text-[#6B726D]">
                Alt: {phoneSecondaryDisplay}
              </p>
            </div>

            <div className="pt-6 w-full">
              <a
                href={`tel:${phonePrimary}`}
                className="w-full py-3 px-4 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#25D366]/40 card-shadow card-shadow-hover text-center flex flex-col justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#25D366] text-white text-[10px] uppercase font-bold tracking-widest py-1 px-4 rounded-bl-xl">
              Quick Reply
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#25D366] font-semibold block mb-1">
                Instant Chat
              </span>
              <h3 className="font-serif text-xl font-bold text-[#163624] mb-2">
                WhatsApp Chat
              </h3>
              <p className="text-base font-bold text-[#163624] mb-1">
                {phonePrimaryDisplay}
              </p>
              <p className="text-xs text-[#6B726D]">
                Fastest response for photos & dates
              </p>
            </div>

            <div className="pt-6 w-full">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Yashwant%20Farm.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Location / Directions */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5DFD7] card-shadow card-shadow-hover text-center flex flex-col justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6 text-[#1F4A32]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-1">
                Farmhouse Address
              </span>
              <h3 className="font-serif text-xl font-bold text-[#163624] mb-2">
                Nandwal, Kolhapur
              </h3>
              <p className="text-xs sm:text-sm text-[#4D433A] mb-1 leading-relaxed">
                {settings?.locationFull || 'Nandwal, Kolhapur, Maharashtra, India'}
              </p>
              <p className="text-xs text-[#6B726D]">
                Host: {settings?.owner || 'Pandurang Yashwant Patil'}
              </p>
            </div>

            <div className="pt-6 w-full">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
