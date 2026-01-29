'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <span className="block font-serif text-[8rem] font-bold leading-none text-cream/5 sm:text-[12rem]">
          404
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{t('eyebrow')}</p>
          <h1 className="font-serif text-3xl text-cream sm:text-4xl">{t('title')}</h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-cream/60">
            {t('description')}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/20 hover:shadow-[0_0_20px_rgba(212,165,116,0.15)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m12 19-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta')}
          </Link>
        </div>
      </div>

      {/* decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-3xl" />
    </main>
  );
}
