'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // Route changed — start progress
      setVisible(true);
      setProgress(30);

      // Simulate progress increments
      const t1 = setTimeout(() => setProgress(60), 100);
      const t2 = setTimeout(() => setProgress(80), 200);
      const t3 = setTimeout(() => setProgress(100), 350);
      const t4 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 600);

      timerRef.current = t4;
      prevPathRef.current = pathname;

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        className="h-full bg-gold shadow-[0_0_8px_rgba(201,169,98,0.5)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
