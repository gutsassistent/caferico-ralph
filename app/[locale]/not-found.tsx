'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularLinks = [
    { href: '/shop' as const, label: t('popularShop') },
    { href: '/subscriptions' as const, label: t('popularSubscriptions') },
    { href: '/about' as const, label: t('popularAbout') },
    { href: '/faq' as const, label: t('popularFaq') },
  ];

  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-16 text-center">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-3xl" />

      {/* Coffee cup illustration */}
      <div className="relative mb-8">
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="mx-auto h-28 w-28 text-gold/20 sm:h-36 sm:w-36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Cup body */}
          <path d="M25 45 h55 l-5 45 c-1 8-8 14-16 14 h-13 c-8 0-15-6-16-14 z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Handle */}
          <path d="M80 55 c12 0 18 8 18 16 s-6 16-18 16" strokeLinecap="round" strokeLinejoin="round" />
          {/* Steam lines */}
          <path d="M40 38 c0-6 6-6 6-12 s-6-6-6-12" strokeLinecap="round" className="text-gold/30" stroke="currentColor" />
          <path d="M53 35 c0-5 5-5 5-10 s-5-5-5-10" strokeLinecap="round" className="text-gold/30" stroke="currentColor" />
          <path d="M66 38 c0-6 6-6 6-12 s-6-6-6-12" strokeLinecap="round" className="text-gold/30" stroke="currentColor" />
          {/* Question mark in cup */}
          <text x="52" y="82" textAnchor="middle" fill="currentColor" stroke="none" fontSize="28" fontFamily="serif" className="text-gold/30">?</text>
        </svg>
      </div>

      {/* Large 404 text */}
      <span className="block font-serif text-[6rem] font-bold leading-none text-cream/[0.06] sm:text-[10rem]">
        404
      </span>

      {/* Content overlaid on 404 */}
      <div className="-mt-16 flex flex-col items-center gap-4 sm:-mt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{t('eyebrow')}</p>
        <h1 className="font-serif text-2xl text-cream sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-cream/60">
          {t('description')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-noir transition hover:bg-gold/90 hover:shadow-[0_0_24px_rgba(201,169,98,0.25)] active:scale-95"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta')}
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-gold transition hover:bg-gold/20 hover:shadow-[0_0_20px_rgba(201,169,98,0.15)] active:scale-95"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('ctaShop')}
          </Link>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-6 w-full max-w-sm" role="search">
          <label htmlFor="notfound-search" className="sr-only">{t('searchPlaceholder')}</label>
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              id="notfound-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-full border border-cream/10 bg-cream/[0.04] py-3 pl-11 pr-4 text-sm text-cream placeholder:text-cream/50 outline-none transition focus:border-gold/40 focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>

        {/* Popular pages */}
        <div className="mt-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cream/60">{t('popularTitle')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-cream/10 px-4 py-2 text-xs text-cream/60 transition hover:border-gold/30 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
