import React from 'react';
import { Calendar, MessageSquare, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Pricing({ onSelectPricing }) {
  const { prices, settings } = useSiteData();

  // Fallback defaults if database is still seeding
  const defaultPrices = [
    {
      _id: 'default-1',
      title: 'Weekday Stay',
      category: 'Monday - Thursday',
      amount: 8500,
      unit: 'per night',
      badge: 'Calm Retreat',
      description: 'Peaceful countryside escape for families and friends. Enjoy full private farmhouse access.',
      features: [
        'Entire Private Farmhouse & Grounds',
        'Full Swimming Pool Access',
        'Equipped Kitchen & Cooking Facility',
        'Accommodates up to 10 Guests',
        'Spacious Vehicle Parking',
        'Peaceful Natural Countryside'
      ],
      active: true
    },
    {
      _id: 'default-2',
      title: 'Weekend Stay',
      category: 'Friday - Sunday',
      amount: 11000,
      unit: 'per night',
      badge: 'Most Popular',
      description: 'Prime weekend getaway. Perfect for reconnecting with family and friends.',
      features: [
        'Entire Private Farmhouse & Grounds',
        'Full Swimming Pool Access',
        'Equipped Kitchen & Cooking Facility',
        'Accommodates up to 10 Guests',
        'Spacious Vehicle Parking',
        'Evening Lawn Gathering Space'
      ],
      active: true
    },
    {
      _id: 'default-3',
      title: 'Day Outing / Picnic',
      category: 'Day Visit (10 AM - 6 PM)',
      amount: 5500,
      unit: 'day pass',
      badge: 'Day Pass',
      description: 'Relaxing day getaway with friends or family without overnight stay.',
      features: [
        'Swimming Pool Access all day',
        'Open Lawn & Shaded Veranda',
        'Cooking & Dining Facility',
        'Up to 10 Visitors included',
        'Changing Rooms & Washrooms',
        'Secure On-site Parking'
      ],
      active: true
    }
  ];

  const activePrices = (prices && prices.length > 0)
    ? prices.filter(p => p.active !== false)
    : defaultPrices;

  const handleScrollToAvailability = () => {
    const el = document.querySelector('#availability');
    if (el) {
      const topOffset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPos = elPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
          Transparent Rates
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
          Stay & Outing Pricing
        </h2>
        <div className="divider-ornament my-4">
          <span className="text-[#C69A52] text-xs">₹</span>
        </div>
        <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
          Simple, honest rates with exclusive private booking. No hidden resort fees.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {activePrices.map((tier) => {
          const isFeatured = tier.badge === 'Most Popular' || tier.title.includes('Weekend');
          
          return (
            <div
              key={tier._id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isFeatured
                  ? 'bg-[#163624] text-white card-shadow scale-[1.02] border-2 border-[#C69A52]'
                  : 'bg-white text-[#222B24] border border-[#E5DFD7] card-shadow card-shadow-hover'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 right-8">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md ${
                    isFeatured
                      ? 'bg-[#C69A52] text-black'
                      : 'bg-[#163624] text-white'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{tier.badge}</span>
                  </span>
                </div>
              )}

              <div>
                <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${
                  isFeatured ? 'text-[#C69A52]' : 'text-[#796E64]'
                }`}>
                  {tier.category}
                </span>

                <h3 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 ${
                  isFeatured ? 'text-white' : 'text-[#163624]'
                }`}>
                  {tier.title}
                </h3>

                {/* Amount display */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`font-serif text-4xl sm:text-5xl font-bold ${
                    isFeatured ? 'text-[#FAF8F5]' : 'text-[#163624]'
                  }`}>
                    {formatCurrency(tier.amount)}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium ${
                    isFeatured ? 'text-white/70' : 'text-[#6B726D]'
                  }`}>
                    / {tier.unit || 'night'}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm mb-6 leading-relaxed ${
                  isFeatured ? 'text-white/80' : 'text-[#6B726D]'
                }`}>
                  {tier.description}
                </p>

                {/* Inclusions list */}
                {tier.features && tier.features.length > 0 && (
                  <div className={`space-y-3 pt-6 border-t ${
                    isFeatured ? 'border-white/15' : 'border-[#F3EFE9]'
                  }`}>
                    {tier.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isFeatured ? 'text-[#C69A52]' : 'text-[#1F4A32]'
                        }`} />
                        <span className={isFeatured ? 'text-white/90' : 'text-[#4D433A]'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-8 space-y-3">
                <button
                  onClick={handleScrollToAvailability}
                  className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isFeatured
                      ? 'bg-[#FAF8F5] text-[#163624] hover:bg-white shadow'
                      : 'bg-[#163624] text-white hover:bg-[#102419]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Availability</span>
                </button>

                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=${encodeURIComponent(
                    `Hello Yashwant Farm, I am enquiring about the ${tier.title} (${tier.category}) at ${formatCurrency(tier.amount)} / ${tier.unit}. Are dates available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isFeatured
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-[#E7EFEA] hover:bg-[#d5e4da] text-[#163624]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust notice */}
      <div className="mt-12 text-center text-xs sm:text-sm text-[#796E64] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#C69A52]" />
        <span>No advance booking fees required to check dates. Direct confirmation with farmhouse manager.</span>
      </div>

    </section>
  );
}
