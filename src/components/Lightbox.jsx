import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (currentIndex === null || !images[currentIndex]) return null;
  const current = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Bar with Counter and Close Button */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-white/80 border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors border border-white/10 focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[82vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.imageUrl || current.src}
          alt={current.altText || current.alt || 'Yashwant Farmhouse Photo'}
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
        />

        {/* Caption */}
        <div className="mt-4 text-center text-white/90 max-w-xl">
          <p className="font-serif text-lg font-medium text-white">
            {current.altText || current.alt || current.imageName}
          </p>
          <span className="text-xs uppercase tracking-widest text-[#C69A52] block mt-1">
            {current.category || 'Yashwant Farmhouse, Nandwal'}
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all border border-white/15 focus:outline-none group"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all border border-white/15 focus:outline-none group"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}
    </div>
  );
}
