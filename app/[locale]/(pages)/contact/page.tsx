import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ContactForm from '@/components/ContactForm';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';

export default async function ContactPage() {
  const t = await getTranslations('Contact');

  return (
    <main className="min-h-screen bg-noir text-cream">
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
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                    {t('hero.card.eyebrow')}
                  </p>
                  <h2 className="text-2xl font-serif text-cream">{t('hero.card.title')}</h2>
                  <p className="text-sm text-cream/70">{t('hero.card.description')}</p>
                </div>
                <div className="space-y-3 text-sm text-cream/70">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.phone')}
                    </span>
                    <span className="text-cream">{t('details.phone')}</span>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.email')}
                    </span>
                    <span className="text-cream">{t('details.email')}</span>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.address')}
                    </span>
                    <span className="text-right text-cream">
                      {t('details.addressLine1')}
                      <br />
                      {t('details.addressLine2')}
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center rounded-full border border-cream/10 bg-noir/70 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-cream/60">
                  {t('hero.card.detail')}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal className="h-full">
            <ContactForm />
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={120}>
              <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-8 shadow-[0_35px_80px_rgba(0,0,0,0.5)]">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('details.eyebrow')}
                </p>
                <h2 className="mt-3 text-2xl font-serif">{t('details.title')}</h2>
                <p className="mt-2 text-sm text-cream/70">{t('details.description')}</p>
                <div className="mt-6 space-y-5 text-sm text-cream/70">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('details.addressTitle')}
                    </p>
                    <p>{t('details.addressLine1')}</p>
                    <p>{t('details.addressLine2')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.phone')}
                    </p>
                    <p>{t('details.phone')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.email')}
                    </p>
                    <p>{t('details.email')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.vat')}
                    </p>
                    <p>{t('details.vat')}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="rounded-3xl border border-cream/10 bg-noir/80 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('hours.title')}
                </p>
                <div className="mt-4 space-y-2 text-sm text-cream/70">
                  <p>{t('hours.weekdays')}</p>
                  <p>{t('hours.weekend')}</p>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-cream/50">
                  {t('hours.note')}
                </p>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('map.eyebrow')}
                </p>
                <h3 className="mt-3 text-xl font-serif">{t('map.title')}</h3>
                <p className="mt-2 text-sm text-cream/70">{t('map.description')}</p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-espresso via-[#1c120d] to-noir">
                  <div className="relative aspect-[4/3]">
                    <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                    <div className="relative flex h-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.4em] text-cream/60">
                      {t('map.placeholder')}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
