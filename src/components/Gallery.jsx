import React, { useState } from 'react';
import { Maximize2, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import Lightbox from './Lightbox';

export default function Gallery() {
  const { gallery } = useSiteData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fallback authentic images if gallery not loaded yet
  const defaultImages = [
    {
      _id: 'default-1',
      imageUrl: '/images/farmhouse-exterior-2.jpg',
      imageName: 'farmhouse-exterior-2.jpg',
      altText: 'Yashwant Farmhouse — full property view with swimming pool and lush greenery',
      featured: true,
      category: 'Property'
    },
    {
      _id: 'default-2',
      imageUrl: '/images/farmhouse-exterior-1.jpg',
      imageName: 'farmhouse-exterior-1.jpg',
      altText: 'Yashwant Farmhouse — red-brick cottage with traditional tiled roof and pool',
      featured: false,
      category: 'Property'
    },
    {
      _id: 'default-3',
      imageUrl: '/images/farmhouse-pool-view.jpg',
      imageName: 'farmhouse-pool-view.jpg',
      altText: 'Private swimming pool at Yashwant Farmhouse with surrounding countryside',
      featured: false,
      category: 'Pool'
    },
    {
      _id: 'default-4',
      imageUrl: '/images/farmhouse-logo.jpg',
      imageName: 'farmhouse-logo.jpg',
      altText: 'Yashwant Farmhouse branding — यशवंत फार्महाऊस Nandwal, Kolhapur',
      featured: false,
      category: 'Brand'
    }
  ];

  const photosList = (gallery && gallery.length > 0) ? gallery : defaultImages;

  // Filter photos by category
  const filteredPhotos = activeCategory === 'All'
    ? photosList
    : photosList.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  // Split photos for layout: 1 main featured, 2 stacked right
  const featuredPhoto = filteredPhotos.find(p => p.featured) || filteredPhotos[0];
  const otherPhotos = filteredPhotos.filter(p => p._id !== featuredPhoto?._id);

  const sideTop = otherPhotos[0] || filteredPhotos[1] || featuredPhoto;
  const sideBottom = otherPhotos[1] || filteredPhotos[2] || sideTop;
  const remainingPhotos = otherPhotos.slice(2);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#F3EFE9]/40 border-y border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Visual Tour
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Farmhouse Gallery
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">📸</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Real snapshots of life, water, and tranquility at Yashwant Farmhouse, Nandwal.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {['All', 'Property', 'Pool', 'Nature'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#163624] text-[#FAF8F5] shadow-sm'
                  : 'bg-white text-[#4D433A] hover:bg-[#E7EFEA] border border-[#E5DFD7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Signature Layout: Large Featured Left + 2 Stacked Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
          
          {/* Main Large Featured Photo (Image 1) */}
          {featuredPhoto && (
            <div
              onClick={() => openLightbox(filteredPhotos.findIndex(p => p._id === featuredPhoto._id))}
              className="lg:col-span-7 group relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden card-shadow cursor-pointer border border-[#E5DFD7]"
            >
              <img
                src={featuredPhoto.imageUrl}
                alt={featuredPhoto.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163624]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-semibold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#C69A52]" />
                  <span>Featured View</span>
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-1">
                    {featuredPhoto.category || 'Farmhouse'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    {featuredPhoto.altText}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#C69A52] group-hover:text-black transition-colors flex-shrink-0 ml-4">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Right Column: 2 Stacked Images (Image 2 and Image 3) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
            
            {/* Image 2 (Top) */}
            {sideTop && (
              <div
                onClick={() => openLightbox(filteredPhotos.findIndex(p => p._id === sideTop._id))}
                className="group relative h-[220px] sm:h-[230px] lg:h-[258px] rounded-3xl overflow-hidden card-shadow cursor-pointer border border-[#E5DFD7]"
              >
                <img
                  src={sideTop.imageUrl}
                  alt={sideTop.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <p className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
                    {sideTop.altText}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#C69A52] group-hover:text-black transition-colors flex-shrink-0 ml-2">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Image 3 (Bottom) */}
            {sideBottom && (
              <div
                onClick={() => openLightbox(filteredPhotos.findIndex(p => p._id === sideBottom._id))}
                className="group relative h-[220px] sm:h-[230px] lg:h-[258px] rounded-3xl overflow-hidden card-shadow cursor-pointer border border-[#E5DFD7]"
              >
                <img
                  src={sideBottom.imageUrl}
                  alt={sideBottom.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <p className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
                    {sideBottom.altText}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#C69A52] group-hover:text-black transition-colors flex-shrink-0 ml-2">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* View Full Gallery Toggle / Remaining Photos */}
        {showAll && remainingPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 animate-fade-in">
            {remainingPhotos.map((photo, i) => (
              <div
                key={photo._id || i}
                onClick={() => openLightbox(filteredPhotos.findIndex(p => p._id === photo._id))}
                className="group relative h-64 rounded-2xl overflow-hidden card-shadow cursor-pointer border border-[#E5DFD7]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <p className="font-serif text-base font-bold line-clamp-1">{photo.altText}</p>
                  <Maximize2 className="w-4 h-4 text-[#C69A52] flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Gallery Action Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => {
              if (remainingPhotos.length > 0) {
                setShowAll(!showAll);
              } else {
                openLightbox(0);
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#163624] font-semibold text-sm border border-[#E5DFD7] hover:border-[#163624] shadow-sm hover:shadow transition-all"
          >
            <Eye className="w-4 h-4 text-[#C69A52]" />
            <span>
              {remainingPhotos.length > 0
                ? (showAll ? 'Collapse Gallery' : `View Full Gallery (${filteredPhotos.length} Photos)`)
                : 'Browse Fullscreen Slideshow'}
            </span>
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0))}
        />
      )}
    </section>
  );
}
