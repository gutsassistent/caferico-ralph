'use client';

import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import { useToast } from '@/components/Toast';

export default function Footer() {
  const t = useTranslations('Layout');
  const toastT = useTranslations('Toast');
  const { showToast } = useToast();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const productLinks = useMemo(
    () => [
      { key: 'mild', href: '/shop' },
      { key: 'intense', href: '/shop' },
      { key: 'espresso', href: '/shop' },
      { key: 'decaf', href: '/shop' },
      { key: 'subscriptions', href: '/subscriptions' },
    ],
    []
  );

  const infoLinks = useMemo(
    () => [
      { key: 'about', href: '/about' },
      { key: 'blog', href: '/blog' },
      { key: 'faq', href: '/faq' },
      { key: 'locations', href: '/verkooppunten' },
      { key: 'contact', href: '/contact' },
    ],
    []
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      showToast(toastT('newsletterSuccess'), 'success');
      setEmail('');
    }
  };

  return (
    <footer className="relative mt-16 border-t border-cream/10 bg-surface-darkest">
      <div className="pointer-events-none absolute inset-0 bg-coffee-glow opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
      <Container className="relative py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Producten */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
              {t('footer.productsTitle')}
            </p>
            <nav className="flex flex-col gap-1 text-sm text-cream/70">
              {productLinks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="py-1 transition hover:text-gold"
                >
                  {t(`footer.products.${item.key}`)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2: Info */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
              {t('footer.infoTitle')}
            </p>
            <nav className="flex flex-col gap-1 text-sm text-cream/70">
              {infoLinks.map((item) => (
                <Link
                  key={item.key}
                  href={`/${item.key}`}
                  className="py-1 transition hover:text-gold"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
              {t('footer.contactTitle')}
            </p>
            <div className="space-y-2 text-sm text-cream/70">
              <p>{t('footer.addressLine1')}</p>
              <p>{t('footer.addressLine2')}</p>
              <p>
                <a
                  href={`tel:${t('footer.phone').replace(/\s/g, '')}`}
                  className="transition hover:text-gold"
                >
                  {t('footer.phone')}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${t('footer.email')}`}
                  className="transition hover:text-gold"
                >
                  {t('footer.email')}
                </a>
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.facebook.com/caferico.be"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition hover:border-gold/60 hover:text-gold"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/caferico.be"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition hover:border-gold/60 hover:text-gold"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 4: Nieuwsbrief */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
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
                className="w-full rounded-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold/70 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full border border-gold/60 px-4 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('footer.newsletterButton')}
              </button>
            </form>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-cream/10 pt-8">
          <span className="text-xs uppercase tracking-[0.2em] text-cream/60">
            {t('footer.certificationsTitle')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/60">
            <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            BE-BIO-02
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/60">
            <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Fair Trade
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/60">
            <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Mayacert
          </span>
        </div>

        {/* Copyright + Payment Methods */}
        <div className="mt-8 flex flex-col gap-4 border-t border-cream/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/60">
            {t('footer.copyright', { year })}
          </p>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-cream/60">{t('footer.paymentTitle')}</span>
            {/* Bancontact */}
            <span className="rounded border border-cream/15 bg-cream/5 px-2 py-0.5 text-xs font-medium text-cream/50">
              Bancontact
            </span>
            {/* PayPal */}
            <span className="rounded border border-cream/15 bg-cream/5 px-2 py-0.5 text-xs font-medium text-cream/50">
              PayPal
            </span>
            {/* Visa */}
            <span className="rounded border border-cream/15 bg-cream/5 px-2 py-0.5 text-xs font-medium text-cream/50">
              Visa
            </span>
            {/* Mastercard */}
            <span className="rounded border border-cream/15 bg-cream/5 px-2 py-0.5 text-xs font-medium text-cream/50">
              Mastercard
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
