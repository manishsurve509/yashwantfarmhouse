import React from 'react';
import { Sun, Waves, HeartHandshake, Trees, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function About() {
  const { settings } = useSiteData();

  const reasons = [
    {
      title: 'Slow Mornings',
      desc: 'Wake up to birdsong and fresh country air. Take your time with a quiet morning surrounded by open skies and green fields.',
      icon: Sun
    },
    {
      title: 'Poolside Moments',
      desc: "Cool off in the private swimming pool. Whether it's a playful splash or a relaxing float, the pool is the heart of every visit.",
      icon: Waves
    },
    {
      title: 'Time with Your People',
      desc: 'A place to reconnect — cook together, share stories, play in the open air. Some of the best memories are made in the simplest settings.',
      icon: HeartHandshake
    },
    {
      title: 'Nature All Around',
      desc: "Fields stretching to the horizon, palm trees swaying gently, fresh air filling your lungs. Here, nature isn't a backdrop — it's the experience.",
      icon: Trees
    }
  ];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
          Discover Our Retreat
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
          A Peaceful Escape from the Everyday
        </h2>
        <div className="divider-ornament my-4">
          <span className="text-[#C69A52] text-xs">🌿</span>
        </div>
        <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
          Escape city rush and step into peaceful countryside warmth in Nandwal, Kolhapur.
        </p>
      </div>

      {/* Main Grid: Story + Farmhouse Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 sm:mb-28">
        
        {/* Farmhouse Image Column */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden card-shadow border border-[#E5DFD7]">
            <img
              src="/images/farmhouse-exterior-1.jpg"
              alt="Yashwant Farmhouse — red-brick cottage with tiled roof surrounded by nature"
              className="w-full h-[380px] sm:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Owner / Location Badge on Image */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#E5DFD7] shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C69A52] block">
                  Family Run & Managed
                </span>
                <p className="font-serif text-lg font-bold text-[#163624]">
                  {settings?.owner || 'Pandurang Yashwant Patil'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6B726D] block">Location</span>
                <span className="text-xs font-semibold text-[#163624]">Nandwal, Kolhapur</span>
              </div>
            </div>
          </div>

          {/* Decorative Backing Frame */}
          <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-3xl border-2 border-[#C69A52]/30 pointer-events-none hidden sm:block" />
        </div>

        {/* Narrative Description Column */}
        <div className="lg:col-span-6 space-y-6 text-[#4D433A]">
          <div className="inline-block px-3 py-1 rounded-full bg-[#E7EFEA] text-[#163624] text-xs font-semibold">
            About Yashwant Farm
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#163624] leading-snug">
            Where time slows down, and every moment feels natural.
          </h3>

          <p className="text-base leading-relaxed text-[#5A5046]">
            Nestled in the quiet countryside of Nandwal, near Kolhapur, Yashwant Farmhouse offers a serene retreat from the pace of everyday life. Surrounded by open fields and fresh air, this is a place where time slows down.
          </p>

          <p className="text-base leading-relaxed text-[#5A5046]">
            Whether you're looking to spend quality time with family, enjoy a relaxed day out with friends, or simply find a quiet corner to unwind — the farmhouse provides a comfortable, peaceful setting for it all.
          </p>

          <p className="text-base leading-relaxed text-[#5A5046]">
            Step outside to wide-open nature, take a dip in the pool, prepare a home-cooked meal together, or simply sit back and enjoy the calm. This is your space to breathe.
          </p>

          {/* Quick bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {[
              'Exclusive property booking',
              'Clean, fresh private pool',
              'Self-cooking facility',
              'Safe on-premise parking'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-[#163624]">
                <CheckCircle2 className="w-4 h-4 text-[#C69A52] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <a
              href="#amenities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#163624] hover:text-[#C69A52] transition-colors"
            >
              <span>Explore Farmhouse Amenities</span>
              <span>→</span>
            </a>
          </div>

        </div>

      </div>

      {/* Why Choose Yashwant Farm? Cards */}
      <div className="bg-[#F3EFE9]/70 rounded-3xl p-8 sm:p-12 border border-[#E5DFD7]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-1">
            The Farm Experience
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#163624]">
            Why Choose Yashwant Farm?
          </h3>
          <p className="text-sm text-[#6B726D] mt-2">
            Authentic countryside living crafted for genuine relaxation and togetherness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5DFD7] card-shadow-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#1F4A32]" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#163624] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B726D] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
