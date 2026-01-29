'use client';

import type { ReactNode } from 'react';

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fadeIn motion-reduce:animate-none">
      {children}
    </div>
  );
}
