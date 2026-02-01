'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const STORAGE_KEY = 'caferico-cookie-consent';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream/10 bg-noir/95 px-4 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-cream/80 sm:text-left">
          {t('message')}{' '}
          <Link href="/privacy" className="underline hover:text-gold">
            {t('privacyLink')}
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-noir transition-colors hover:bg-gold/90"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
