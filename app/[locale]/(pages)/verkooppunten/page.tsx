import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import LocationsGrid from '@/components/LocationsGrid';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'locations', path: 'verkooppunten' });
}

export default async function LocationsPage() {
  const t = await getTranslations('Locations');

  return (
    <main className="min-h-screen bg-noir text-cream">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          speed={0.06}
        />
        <ParallaxOrb
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl"
          speed={0.04}
        />

        <Container className="relative py-24 sm:py-32">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              {t('hero.eyebrow')}
            </p>
            <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-cream/60">
              {t('hero.description')}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Locations grid */}
      <section className="py-16 sm:py-24">
        <Container>
          <LocationsGrid />
        </Container>
      </section>
    </main>
  );
}
