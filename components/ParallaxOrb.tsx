'use client';

import { useEffect, useRef } from 'react';

type ParallaxOrbProps = {
  className?: string;
  speed?: number;
};

export default function ParallaxOrb({ className, speed = 0.08 }: ParallaxOrbProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    let raf = 0;

    const updatePosition = () => {
      const offset = window.scrollY * speed;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
      raf = 0;
    };

    const handleScroll = () => {
      if (raf) {
        return;
      }
      raf = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [speed]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
