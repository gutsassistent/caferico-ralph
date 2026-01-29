'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';

type HeroParallaxProps = {
  children: ReactNode;
  imageUrl: string;
  imageAlt: string;
};

export default function HeroParallax({ children, imageUrl, imageAlt }: HeroParallaxProps) {
  const containerRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const updateParallax = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0)`;
      }
      rafRef.current = 0;
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && !rafRef.current) {
          rafRef.current = requestAnimationFrame(updateParallax);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative isolate min-h-[90vh] overflow-hidden"
    >
      {/* Background image with parallax */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 -top-20 -bottom-20 will-change-transform"
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/50 to-noir/90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-noir/60 to-transparent" />

      {/* Content with fade-in */}
      <div
        className={`relative flex min-h-[90vh] items-center transition-all duration-1000 ease-out motion-reduce:transition-none ${
          loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
