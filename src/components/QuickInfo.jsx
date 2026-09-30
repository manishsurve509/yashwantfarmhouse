import React from 'react';
import { Home, MapPin, Users, Trees, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function QuickInfo() {
  const { settings } = useSiteData();

  const highlights = [
    {
      icon: '🏡',
      title: 'Private Farmhouse',
      subtitle: 'Exclusive Brick Villa',
      description: 'Traditional red-brick cottage with tiled roof, private swimming pool and open patio.'
    },
    {
      icon: '📍',
      title: 'Nandwal, Kolhapur',
      subtitle: 'Quiet Countryside',
      description: 'Nestled in peaceful Nandwal countryside, just 20-25 mins drive from Kolhapur city.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family & Group Friendly',
      subtitle: 'Cherished Moments',
      description: 'Ideal for family getaways, gatherings of friends, and celebrations in total privacy.'
    },
    {
      icon: '🌿',
      title: 'Nature Getaway',
      subtitle: 'Fresh Country Air',
      description: 'Surrounded by lush green open fields, coconut palms, and birdsong. Space to unwind.'
    }
  ];

  return (
    <section id="quick-info" className="relative -mt-10 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-7 card-shadow card-shadow-hover border border-[#E5DFD7]/80 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E5DFD7] flex items-center justify-center text-2xl mb-4 shadow-sm">
                {item.icon}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C69A52] block mb-1">
                {item.subtitle}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163624] mb-2 leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#6B726D] leading-relaxed mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
