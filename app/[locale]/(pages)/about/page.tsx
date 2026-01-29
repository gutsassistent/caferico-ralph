import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';

const pillarKeys = ['eerlijk', 'ecologisch', 'honduras', 'smaak'] as const;
const processSteps = ['pluk', 'wassen', 'drogen', 'branden', 'kopje'] as const;
const farmerKeys = ['tom', 'lesly'] as const;

/* SVG icons per pillar */
const pillarIcons: Record<string, React.ReactNode> = {
  eerlijk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path d="M12 2L2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  ecologisch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z" />
      <path d="M12 12v6" />
      <path d="M9 15l3-3 3 3" />
    </svg>
  ),
  honduras: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  ),
  smaak: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" />
      <path d="M6 1v3" />
      <path d="M10 1v3" />
      <path d="M14 1v3" />
    </svg>
  ),
};

/* SVG icons per process step */
const processIcons: Record<string, React.ReactNode> = {
  pluk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 22c-4.97 0-9-2.24-9-5v-4c0-2.76 4.03-5 9-5s9 2.24 9 5v4c0 2.76-4.03 5-9 5Z" />
      <path d="M12 8V2" />
      <path d="M9 4l3-2 3 2" />
    </svg>
  ),
  wassen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M2 12h20" />
      <path d="M6 12c0-3 2-6 6-6s6 3 6 6" />
      <path d="M4 16c1 2 4 4 8 4s7-2 8-4" />
    </svg>
  ),
  drogen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  branden: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 12c2-3 0-6-2-8 4 2 8 6 8 10a8 8 0 1 1-16 0c0-2 1-3 2-4 0 3 2 5 4 5s4-1 4-3Z" />
    </svg>
  ),
  kopje: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" />
      <path d="M6 1v3" />
      <path d="M10 1v3" />
      <path d="M14 1v3" />
    </svg>
  ),
};

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <main className="min-h-screen bg-noir text-cream">
      {/* Hero with Honduras background image */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="https://www.caferico.be/wp-content/uploads/2025/05/DSCF3617.jpg"
          alt="Honduras koffieplantage sfeerbeeld"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/80 via-noir/60 to-noir" />
        <div className="relative flex min-h-[70vh] items-center">
          <Container className="space-y-6 py-24">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">
              {t('hero.eyebrow')}
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="max-w-2xl text-base text-cream/80 sm:text-lg">
              {t('hero.description')}
            </p>
            <Link
              href="/shop"
              className="inline-block rounded-full bg-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90"
            >
              {t('hero.cta')}
            </Link>
          </Container>
        </div>
      </section>

      {/* Intro section */}
      <Reveal>
        <section className="py-16 sm:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('intro.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('intro.title')}</h2>
              <p className="text-sm leading-relaxed text-cream/70 sm:text-base">
                {t('intro.description')}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://www.caferico.be/wp-content/uploads/2018/05/koffieboer-4-Copy-1000×536.jpg"
                alt="Koffieboer in Honduras"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Container>
        </section>
      </Reveal>

      {/* 4 Pillars: (H)eerlijk, Ecologisch, Honduras, Smaak */}
      <Reveal>
        <section className="relative overflow-hidden border-y border-cream/10 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(60,21,24,0.5),rgba(26,15,10,0.95))]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-20" />
          <Container className="relative space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('pillars.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('pillars.title')}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {pillarKeys.map((key, index) => (
                <Reveal key={key} delay={index * 120}>
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-noir/80 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                      {pillarIcons[key]}
                    </div>
                    <h3 className="mt-5 font-serif text-2xl text-cream">
                      {t(`pillars.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/70">
                      {t(`pillars.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      {/* Farmer profiles */}
      <Reveal>
        <section className="py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('farmers.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('farmers.title')}</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {farmerKeys.map((key, index) => (
                <Reveal key={key} delay={index * 150}>
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-8">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      {key === 'tom' ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src="https://www.caferico.be/wp-content/uploads/2018/05/Tom-Janssens.jpg"
                            alt={t(`farmers.${key}.name`)}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-2xl text-gold">
                          L
                        </div>
                      )}
                      <div>
                        <p className="font-serif text-lg text-cream">{t(`farmers.${key}.name`)}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                          {t(`farmers.${key}.role`)}
                        </p>
                      </div>
                    </div>
                    {/* Quote */}
                    <div className="mt-6 border-l-2 border-gold/30 pl-5">
                      <p className="text-sm italic leading-relaxed text-cream/70">
                        &ldquo;{t(`farmers.${key}.quote`)}&rdquo;
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      {/* Process visualization: pluk → wassen → drogen → branden → kopje */}
      <Reveal>
        <section className="relative overflow-hidden border-t border-cream/10 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.08),transparent_70%)]" />
          <Container className="relative space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('process.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('process.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('process.description')}</p>
            </div>

            {/* Desktop: horizontal flow */}
            <div className="hidden lg:block">
              <div className="flex items-start justify-between">
                {processSteps.map((step, index) => (
                  <Reveal key={step} delay={index * 100} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
                      {processIcons[step]}
                    </div>
                    {/* Arrow between steps */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-2">
                        {/* handled below with relative */}
                      </div>
                    )}
                    <h3 className="mt-4 font-serif text-lg text-cream">
                      {t(`process.steps.${step}.title`)}
                    </h3>
                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-cream/60">
                      {t(`process.steps.${step}.description`)}
                    </p>
                  </Reveal>
                ))}
              </div>
              {/* Arrow connectors */}
              <div className="mt-[-120px] flex items-center justify-between px-[10%]">
                {[0, 1, 2, 3].map((i) => (
                  <svg key={i} viewBox="0 0 40 20" className="h-5 w-10 text-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M0 10h30M25 5l5 5-5 5" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Mobile: vertical steps */}
            <div className="space-y-6 lg:hidden">
              {processSteps.map((step, index) => (
                <Reveal key={step} delay={index * 100}>
                  <div className="flex items-start gap-5">
                    <div className="flex shrink-0 flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                        {processIcons[step]}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="mt-2 h-8 w-px bg-gold/20" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-cream">
                        {t(`process.steps.${step}.title`)}
                      </h3>
                      <p className="mt-1 text-sm text-cream/60">
                        {t(`process.steps.${step}.description`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      {/* Honduras map & droogtunnel images */}
      <Reveal>
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://www.caferico.be/wp-content/uploads/2018/05/marcala-landschap.png"
                  alt="Marcala landschap Honduras"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://www.caferico.be/wp-content/uploads/2018/05/droogtunnel-klein.png"
                  alt="Droogtunnel voor koffiebonen"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
