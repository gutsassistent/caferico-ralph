'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/components/CartProvider';
import { locales } from '@/lib/i18n';
import { navItems } from '@/lib/navigation';

export default function Header() {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { data: session, status: authStatus } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bounce cart icon when items are added
  useEffect(() => {
    if (mounted && totalItems > prevTotalRef.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems, mounted]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = () => setLangOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [langOpen]);

  // Close account dropdown on outside click
  useEffect(() => {
    if (!accountOpen) return;
    const handleClick = () => setAccountOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [accountOpen]);

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

  const handleLocaleChange = useCallback(
    (nextLocale: string) => {
      if (!pathname) return;
      const query = searchParams.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url, { locale: nextLocale as typeof locale });
      setMobileOpen(false);
      setLangOpen(false);
    },
    [pathname, searchParams, router, locale]
  );

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-noir/95 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo — left */}
            <Link
              href="/"
              className="relative z-10 transition-opacity duration-300 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              aria-label={t('logoAlt')}
            >
              <Image
                src="/logo.png"
                alt={t('logoAlt')}
                width={48}
                height={48}
                className="h-10 w-auto rounded-lg shadow-lg sm:h-12"
                priority
              />
            </Link>

            {/* Nav — center (desktop) */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`group relative py-2 text-xs uppercase tracking-[0.3em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-noir ${
                    isActive(item.href) ? 'text-gold' : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  {item.label}
                  {/* Underline animation */}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions — right */}
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {/* Language switcher (desktop) */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLangOpen((v) => !v);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-cream/20 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-cream/80 transition-all duration-300 hover:border-gold/50 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  aria-label={t('actions.language')}
                  aria-expanded={langOpen}
                >
                  {locale.toUpperCase()}
                  <svg
                    className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Language dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 min-w-[140px] overflow-hidden rounded-xl border border-cream/10 bg-noir/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 ${
                    langOpen
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => handleLocaleChange(option.code)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-200 focus:outline-none focus-visible:bg-cream/5 ${
                        option.code === locale
                          ? 'bg-gold/10 text-gold'
                          : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart button */}
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:border-gold/50 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label={t('actions.cart')}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4.5 9h15l-1.12 9.43a2 2 0 0 1-1.99 1.57H7.61a2 2 0 0 1-1.99-1.57L4.5 9Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 9V6a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
                  <ellipse cx="12" cy="14.5" rx="1.25" ry="1.75" stroke="currentColor" strokeWidth="1.25" />
                </svg>
                {mounted && totalItems > 0 && (
                  <span
                    className={`absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-xs font-bold text-noir ${cartBounce ? 'animate-cart-bounce' : ''}`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account button */}
              {authStatus === 'loading' ? (
                <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-cream/20 sm:inline-flex">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-cream/20" />
                </div>
              ) : session ? (
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOpen((v) => !v);
                    }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-all duration-300 hover:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                    aria-label={t('actions.account')}
                    aria-expanded={accountOpen}
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
                        {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                      </span>
                    )}
                  </button>

                  {/* Account dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-2 min-w-[180px] overflow-hidden rounded-xl border border-cream/10 bg-noir/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 ${
                      accountOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    <Link
                      href="/account"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-cream/70 transition-colors duration-200 hover:bg-cream/5 hover:text-cream focus:outline-none focus-visible:bg-cream/5"
                      onClick={() => setAccountOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 20a8 8 0 1 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="8" r="3" />
                      </svg>
                      {t('actions.myAccount')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex w-full items-center gap-2 border-t border-cream/10 px-4 py-2.5 text-left text-sm text-cream/70 transition-colors duration-200 hover:bg-cream/5 hover:text-cream focus:outline-none focus-visible:bg-cream/5"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t('actions.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:border-gold/50 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:inline-flex"
                  aria-label={t('actions.login')}
                >
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
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:border-gold/50 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? t('actions.closeMenu') : t('actions.menu')}
              >
                {/* Animated hamburger → X */}
                <div className="flex h-5 w-5 flex-col items-center justify-center">
                  <span
                    className={`block h-px w-4 bg-current transition-all duration-300 ${
                      mobileOpen ? 'translate-y-[3px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`mt-1.5 block h-px w-4 bg-current transition-all duration-300 ${
                      mobileOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`mt-1.5 block h-px w-4 bg-current transition-all duration-300 ${
                      mobileOpen ? '-translate-y-[9px] -rotate-45' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen slide-in overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-noir/80 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel — slides in from right */}
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-noir shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button area — aligned with header height */}
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors duration-200 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              aria-label={t('actions.closeMenu')}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 px-6 pt-4">
            {navLinks.map((item, i) => (
              <Link
                key={item.key}
                href={item.href}
                className={`group flex items-center rounded-lg px-4 py-3.5 text-base uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                  isActive(item.href)
                    ? 'bg-gold/10 text-gold'
                    : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(20px)'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Account (mobile) */}
          <div className="border-t border-cream/10 px-6 py-4">
            {session ? (
              <div className="flex flex-col gap-1">
                <Link
                  href="/account"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-cream/70 transition-colors duration-200 hover:bg-cream/5 hover:text-cream"
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-semibold text-gold">
                      {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                    </span>
                  )}
                  {t('actions.myAccount')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-cream/70 transition-colors duration-200 hover:bg-cream/5 hover:text-cream"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('actions.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-cream/70 transition-colors duration-200 hover:bg-cream/5 hover:text-cream"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 20a8 8 0 1 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="8" r="3" />
                </svg>
                {t('actions.login')}
              </Link>
            )}
          </div>

          {/* Language switcher (mobile) */}
          <div className="border-t border-cream/10 px-6 py-6">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cream/50">
              {t('actions.language')}
            </p>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleLocaleChange(option.code)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                    option.code === locale
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-cream/20 text-cream/60 hover:border-cream/40 hover:text-cream'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
