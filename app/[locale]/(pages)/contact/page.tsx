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
                    <a href={`tel:${t('details.phone')}`} className="text-cream transition hover:text-gold">{t('details.phone')}</a>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t('labels.email')}
                    </span>
                    <a href={`mailto:${t('details.email')}`} className="text-cream transition hover:text-gold">{t('details.email')}</a>
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
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                        {t('details.addressTitle')}
                      </p>
                      <p>{t('details.addressLine1')}</p>
                      <p>{t('details.addressLine2')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                        {t('labels.phone')}
                      </p>
                      <a href={`tel:${t('details.phone')}`} className="transition hover:text-gold">{t('details.phone')}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                        {t('labels.email')}
                      </p>
                      <a href={`mailto:${t('details.email')}`} className="transition hover:text-gold">{t('details.email')}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                        {t('labels.vat')}
                      </p>
                      <p>{t('details.vat')}</p>
                    </div>
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
