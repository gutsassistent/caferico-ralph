'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Container from '@/components/Container';
import { locales } from '@/lib/i18n';
import { navItems } from '@/lib/navigation';

export default function Header() {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = useMemo(
    () =>
      navItems.map((item) => ({
        key: item.key,
        href: item.href,
        label: t(`nav.${item.key}`)
      })),
    [t]
  );

  const languageOptions = useMemo(
    () =>
      locales.map((code) => ({
        code,
        label: t(`languages.${code}`)
      })),
    [t]
  );

  const handleLocaleChange = (nextLocale: string) => {
    if (!pathname) {
      return;
    }

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { locale: nextLocale as typeof locale });
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-cream/10 bg-noir/95 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <Container className="py-4">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.2em] text-cream transition hover:text-gold"
          >
            {t('logo')}
          </Link>

          <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-cream/70 lg:flex">
            {navLinks.map((item) => (
              <Link key={item.key} href={item.href} className="transition hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <label htmlFor="locale-switch" className="sr-only">
                {t('actions.language')}
              </label>
              <select
                id="locale-switch"
                value={locale}
                onChange={(event) => handleLocaleChange(event.target.value)}
                className="rounded-full border border-cream/20 bg-transparent px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream/80 transition hover:border-gold/60 focus:border-gold/80 focus:outline-none"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code} className="text-noir">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold/60 hover:text-gold"
            >
              <span className="sr-only">{t('actions.cart')}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 7h12l-1.2 12H7.2L6 7Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
              </svg>
              {mounted && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-noir">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold/60 hover:text-gold"
            >
              <span className="sr-only">{t('actions.account')}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 20a8 8 0 1 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="8" r="3" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold/60 hover:text-gold lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {mobileOpen ? t('actions.closeMenu') : t('actions.menu')}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 7h16" strokeLinecap="round" />
                <path d="M4 12h16" strokeLinecap="round" />
                <path d="M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 rounded-2xl border border-cream/10 bg-[#120907]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <nav className="flex flex-col gap-3 text-sm uppercase tracking-[0.2em] text-cream/80">
              {navLinks.map((item) => (
                <Link key={item.key} href={item.href} className="transition hover:text-gold">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-cream/10 pt-4">
              <label
                htmlFor="mobile-locale-switch"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('actions.language')}
              </label>
              <select
                id="mobile-locale-switch"
                value={locale}
                onChange={(event) => handleLocaleChange(event.target.value)}
                className="mt-2 w-full rounded-full border border-cream/20 bg-transparent px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream/80"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code} className="text-noir">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
