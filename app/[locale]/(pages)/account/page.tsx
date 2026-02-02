import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import AccountProfile from '@/components/AccountProfile';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

// Note: auth guard for /account is handled by middleware.ts (getToken check)
// No server-side redirect here to avoid conflicts with middleware

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'account', path: 'account' });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Account');

  const accountBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: t('title'), url: `https://caferico.be/${locale}/account` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(accountBreadcrumb) }}
      />
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          speed={0.08}
        />
        <ParallaxOrb
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl"
          speed={0.12}
        />

        <Container className="relative py-16 sm:py-24">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
              {t('eyebrow')}
            </p>
            <h1 className="mt-3 text-4xl font-serif leading-tight sm:text-5xl">
              {t('title')}
            </h1>
          </div>
        </Container>
      </section>

      <section className="section-light py-16 sm:py-24">
        <Container className="max-w-3xl">
          <AccountProfile />
        </Container>
      </section>
    </main>
  );
}
