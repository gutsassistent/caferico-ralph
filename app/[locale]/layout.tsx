import { type ReactNode, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter, Playfair_Display } from 'next/font/google';
import { locales } from '@/lib/i18n';
import { CartProvider } from '@/components/CartProvider';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import ScrollToTop from '@/components/ScrollToTop';
import CookieConsent from '@/components/CookieConsent';
import NavigationProgress from '@/components/NavigationProgress';
import { ToastProvider } from '@/components/Toast';
import AuthSessionProvider from '@/components/AuthSessionProvider';
import { organizationSchema, localBusinessSchema, jsonLd } from '@/lib/structured-data';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="dns-prefetch" href="https://www.caferico.be" />
        <link rel="preconnect" href="https://www.caferico.be" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema()) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-noir text-cream antialiased`}>
        <AuthSessionProvider>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <CartProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-noir focus:font-semibold focus:outline-none"
              >
                Skip to main content
              </a>
              <NavigationProgress />
              <div className="flex min-h-screen flex-col">
                <Suspense fallback={null}>
                  <Header />
                </Suspense>
                <PageTransition>
                  <main id="main-content" className="flex-1">{children}</main>
                </PageTransition>
                <Footer />
              </div>
              <CartDrawer />
              <ScrollToTop />
              <CookieConsent />
            </CartProvider>
          </ToastProvider>
        </NextIntlClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
