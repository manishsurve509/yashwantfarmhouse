import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Location() {
  const { settings } = useSiteData();

  const embedUrl = settings?.mapsEmbedUrl ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000';

  const directionsUrl = settings?.mapsUrl || 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw';

  return (
    <section id="location" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Find Us
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Farmhouse Location
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">📍</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Conveniently situated in scenic Nandwal, an easy drive from Kolhapur city.
          </p>
        </div>

        {/* Location Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Information Card (Left) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E5DFD7] card-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#1F4A32]" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-1">
                Official Address
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#163624] mb-2">
                {settings?.farmhouseName || 'Yashwant Farm'}
              </h3>
              <p className="font-serif text-lg text-[#C69A52] mb-4">
                {settings?.nameMarathi || 'यशवंत फार्महाऊस'}
              </p>

              <div className="space-y-4 pt-4 border-t border-[#F3EFE9] text-sm text-[#4D433A]">
                <div>
                  <span className="font-semibold text-xs text-[#796E64] uppercase block">Village & City</span>
                  <p className="text-base font-medium text-[#163624]">
                    {settings?.locationFull || 'Nandwal, Kolhapur, Maharashtra, India'}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-xs text-[#796E64] uppercase block">Surroundings</span>
                  <p className="text-sm text-[#6B726D]">
                    Quiet rural landscape surrounded by green sugarcane fields, open trees, and fresh breeze.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-xs text-[#796E64] uppercase block">Accessibility</span>
                  <p className="text-sm text-[#6B726D]">
                    Smooth asphalt roads lead directly to the property with spacious vehicle parking inside.
                  </p>
                </div>
              </div>
            </div>

            {/* Action: Get Directions Button */}
            <div className="pt-8">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow hover:shadow-md"
              >
                <Navigation className="w-4 h-4 text-[#C69A52]" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/70" />
              </a>
            </div>

          </div>

          {/* Interactive Google Map Embed (Right) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden card-shadow border border-[#E5DFD7] h-[400px] sm:h-[480px] lg:h-auto min-h-[380px] relative bg-[#E7EFEA]">
            <iframe
              src={embedUrl}
              title="Yashwant Farmhouse Location Nandwal Kolhapur"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
