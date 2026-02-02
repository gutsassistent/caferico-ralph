import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import CheckoutReturn from '@/components/CheckoutReturn';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'checkoutReturn', path: 'checkout/return' });
}

export default async function CheckoutReturnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Checkout');

  const returnBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: t('hero.title'), url: `https://caferico.be/${locale}/checkout` },
    { name: t('return.title'), url: `https://caferico.be/${locale}/checkout/return` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(returnBreadcrumb) }}
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

        <Container className="relative py-20">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
              {t('return.eyebrow')}
            </p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('return.title')}
            </h1>
          </div>
        </Container>
      </section>

      <section className="section-light py-16 sm:py-24">
        <Container>
          <CheckoutReturn />
        </Container>
      </section>
    </main>
  );
}
