import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import FaqExplorer from '@/components/FaqExplorer';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'faq', path: 'faq' });
}

export default async function FaqPage() {
  const t = await getTranslations('Faq');

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          speed={0.06}
        />
        <ParallaxOrb
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl"
          speed={0.1}
        />

        <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-cream/70 sm:text-base">{t('hero.description')}</p>
            <div className="inline-flex items-center gap-3 rounded-full border border-cream/10 bg-noir/70 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-cream/60">
              <span className="h-2 w-2 rounded-full bg-gold/80" aria-hidden="true" />
              {t('hero.badge')}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-cream/10 bg-[#140b08] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('hero.card.eyebrow')}
                </p>
                <h2 className="text-2xl font-serif text-cream">{t('hero.card.title')}</h2>
                <p className="text-sm text-cream/70">{t('hero.card.description')}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('hero.card.detail')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Reveal>
        <section className="py-20">
          <Container>
            <FaqExplorer />
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
