import React from 'react';
import { Waves, Home, UtensilsCrossed, Car, Trees, Users2, Sparkles, Check } from 'lucide-react';

export default function Amenities() {
  const amenitiesList = [
    {
      name: 'Swimming Pool',
      desc: 'A private pool for a refreshing dip — the highlight of every visit.',
      icon: Waves,
      tag: 'Highlight'
    },
    {
      name: 'Comfortable Accommodation',
      desc: 'A well-maintained brick cottage with a traditional tiled roof for a comfortable stay.',
      icon: Home,
      tag: 'Overnight'
    },
    {
      name: 'Cooking Facility',
      desc: 'Prepare your own meals and enjoy the charm of cooking together in a countryside setting.',
      icon: UtensilsCrossed,
      tag: 'Self-Cooking'
    },
    {
      name: 'Convenient Parking',
      desc: 'Convenient and safe vehicle parking available directly on the premises.',
      icon: Car,
      tag: 'Secure'
    },
    {
      name: 'Peaceful Environment',
      desc: 'Surrounded by open fields and fresh air — a calm escape from city noise.',
      icon: Trees,
      tag: 'Natural'
    },
    {
      name: 'Family & Group Friendly',
      desc: 'Designed for families, friends, and small groups to celebrate and enjoy together.',
      icon: Users2,
      tag: 'Private'
    }
  ];

  return (
    <section id="amenities" className="py-20 sm:py-28 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Comfort & Facilities
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Amenities & Facilities
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">✦</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Everything you need for an easy, delightful countryside stay with family and friends.
          </p>
        </div>

        {/* 6 Luxury Amenity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {amenitiesList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 border border-[#E5DFD7] card-shadow card-shadow-hover relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#E7EFEA] text-[#163624] group-hover:bg-[#163624] group-hover:text-[#FAF8F5] transition-colors duration-300 flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#C69A52] border border-[#E5DFD7]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#163624] mb-2.5">
                    {item.name}
                  </h3>

                  <p className="text-sm text-[#6B726D] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#F3EFE9] flex items-center gap-2 text-xs font-medium text-[#163624]">
                  <Check className="w-3.5 h-3.5 text-[#C69A52]" />
                  <span>Verified facility at Yashwant Farm</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Amenity Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#163624] to-[#1F4A32] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-1">
              Complete Privacy
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF8F5]">
              Exclusive Private Access For Your Group Only
            </h4>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              We never host multiple unrelated groups simultaneously. You and your loved ones enjoy the entire property exclusively.
            </p>
          </div>
          <a
            href="#enquiry"
            className="px-6 py-3 rounded-full bg-[#FAF8F5] text-[#163624] font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all shadow whitespace-nowrap"
          >
            Enquire Now
          </a>
        </div>

      </div>
    </section>
  );
}
