'use client';

import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import { useToast } from '@/components/Toast';
import { navItems } from '@/lib/navigation';

export default function Footer() {
  const t = useTranslations('Layout');
  const toastT = useTranslations('Toast');
  const { showToast } = useToast();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const navLinks = useMemo(
    () =>
      navItems.map((item) => ({
        key: item.key,
        href: item.href,
        label: t(`nav.${item.key}`)
      })),
    [t]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      showToast(toastT('newsletterSuccess'), 'success');
      setEmail('');
    }
  };

  return (
    <footer className="relative mt-16 border-t border-cream/10 bg-[#120907]">
      <div className="pointer-events-none absolute inset-0 bg-coffee-glow opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
      <Container className="relative py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div className="space-y-4">
            <p className="font-serif text-lg tracking-[0.2em] text-cream">{t('logo')}</p>
            <p className="text-sm text-cream/70">{t('footer.tagline')}</p>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('footer.socialTitle')}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-cream/70">
                <a href="#" className="transition hover:text-gold">
                  {t('social.instagram')}
                </a>
                <a href="#" className="transition hover:text-gold">
                  {t('social.linkedin')}
                </a>
                <a href="#" className="transition hover:text-gold">
                  {t('social.pinterest')}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
              {t('footer.sitemapTitle')}
            </p>
            <nav className="flex flex-col gap-2 text-sm text-cream/70">
              {navLinks.map((item) => (
                <Link key={item.key} href={item.href} className="transition hover:text-gold">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('footer.contactTitle')}
              </p>
              <div className="mt-3 space-y-2 text-sm text-cream/70">
                <p>{t('footer.addressLine1')}</p>
                <p>{t('footer.addressLine2')}</p>
                <p>{t('footer.phone')}</p>
                <p>{t('footer.email')}</p>
                <p>{t('footer.vat')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('footer.hoursTitle')}
              </p>
              <div className="mt-2 space-y-1 text-sm text-cream/70">
                <p>{t('footer.hoursWeekdays')}</p>
                <p>{t('footer.hoursWeekend')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
              {t('footer.newsletterTitle')}
            </p>
            <p className="text-sm text-cream/70">{t('footer.newsletterDescription')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="newsletter" className="sr-only">
                {t('footer.newsletterLabel')}
              </label>
              <input
                id="newsletter"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                className="w-full rounded-full border border-cream/20 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-cream/40 focus:border-gold/70 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full border border-gold/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('footer.newsletterButton')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/10 pt-6 text-xs uppercase tracking-[0.3em] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright', { year })}</p>
        </div>
      </Container>
    </footer>
  );
}
