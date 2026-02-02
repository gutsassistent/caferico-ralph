'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

type ProductImageGalleryProps = {
  images: GalleryImage[];
  productName: string;
  badge?: string;
};

export default function ProductImageGallery({
  images,
  productName,
  badge
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    []
  );

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
    setZoomActive(false);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
    },
    [handlePrev, handleNext, lightboxOpen]
  );

  return (
    <>
      <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={-1}>
        {/* Main image */}
        <div
          ref={mainRef}
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl border border-cream/10 bg-gradient-to-br from-espresso via-surface-mid to-noir shadow-[0_35px_70px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => setZoomActive(true)}
          onMouseLeave={() => setZoomActive(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          role="button"
          aria-label={`Zoom ${productName}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
        >
          {activeImage?.src ? (
            <Image
              src={activeImage.src}
              alt={activeImage.alt || productName}
              fill
              className={`object-cover transition-transform duration-500 ${
                zoomActive ? 'scale-[1.8]' : 'scale-100'
              }`}
              style={
                zoomActive
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority

            />
          ) : (
            <>
              <div className="absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.35),_transparent_60%)]" />
            </>
          )}

          {badge && (
            <div className="absolute bottom-5 left-5 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cream/70">
              {badge}
            </div>
          )}

          {/* Zoom hint icon */}
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-noir/60 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cream/70"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-noir/60 p-3 opacity-0 transition-opacity duration-300 hover:bg-noir/80 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label="Previous image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-cream"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-noir/60 p-3 opacity-0 transition-opacity duration-300 hover:bg-noir/80 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label="Next image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-cream"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => handleThumbnailClick(index)}
                className={`relative aspect-square flex-1 overflow-hidden rounded-2xl border transition-all duration-300 ${
                  index === activeIndex
                    ? 'border-gold/70 ring-2 ring-gold/30'
                    : 'border-cream/10 hover:border-cream/30'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt || productName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12vw"
      
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-mid via-surface-darkest to-noir">
                    <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightboxOpen && activeImage?.src && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-noir/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={productName}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-cream/10 p-3 text-cream transition hover:bg-cream/20 focus-visible:ring-2 focus-visible:ring-gold/60"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream transition hover:bg-cream/20 focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label="Previous image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream transition hover:bg-cream/20 focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label="Next image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt || productName}
              width={1200}
              height={1500}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"

            />
          </div>

          {/* Lightbox thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThumbnailClick(index);
                  }}
                  className={`h-3 w-3 rounded-full p-0 transition-all ${
                    index === activeIndex
                      ? 'scale-125 bg-gold'
                      : 'bg-cream/30 hover:bg-cream/50'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
