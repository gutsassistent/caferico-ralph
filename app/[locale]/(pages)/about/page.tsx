import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';

type AboutPageProps = {
  params: { locale: string };
};

const highlightKeys = ['one', 'two', 'three'] as const;
const missionPoints = ['one', 'two', 'three'] as const;
const visionPoints = ['one', 'two', 'three'] as const;
const timelineKeys = ['one', 'two', 'three', 'four', 'five'] as const;
const teamKeys = ['founder', 'roaster', 'curator', 'hospitality'] as const;

export default async function AboutPage({ params }: AboutPageProps) {
  const t = await getTranslations('About');
  const locale = params.locale;

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(26,15,10,0.95),rgba(60,21,24,0.92),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          speed={0.06}
        />
        <ParallaxOrb
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl"
          speed={0.1}
        />

        <Container className="relative grid gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-base text-cream/80 sm:text-lg">{t('hero.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/shop`}
                className="rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('hero.primaryCta')}
              </Link>
              <Link
                href={`/${locale}/about#story`}
                className="rounded-full border border-cream/30 px-6 py-3 text-xs uppercase tracking-[0.3em] text-cream/80 transition hover:border-cream/60 hover:text-cream"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cream/10 bg-noir/70 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-cream/60">
              <span className="h-2 w-2 rounded-full bg-gold/80" aria-hidden="true" />
              {t('hero.badge')}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-espresso via-[#1c120d] to-noir shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.3),_transparent_60%)]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-cream/10 bg-noir/70 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  {t('hero.card.eyebrow')}
                </p>
                <p className="mt-2 text-lg font-serif text-cream">{t('hero.card.title')}</p>
                <p className="mt-1 text-sm text-cream/70">
                  {t('hero.card.description')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Reveal>
        <section id="story" className="py-20">
          <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('story.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('story.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">
                {t('story.description')}
              </p>
              <div className="space-y-4 text-sm text-cream/70">
                <p>{t('story.paragraphs.one')}</p>
                <p>{t('story.paragraphs.two')}</p>
                <p>{t('story.paragraphs.three')}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-8 shadow-[0_35px_70px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('story.highlightsTitle')}
                </p>
                <div className="mt-6 grid gap-4">
                  {highlightKeys.map((key, index) => (
                    <Reveal key={key} delay={index * 120}>
                      <div className="rounded-2xl border border-cream/10 bg-noir/80 p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                          {t(`story.highlights.${key}.label`)}
                        </p>
                        <p className="mt-2 text-2xl font-serif text-cream">
                          {t(`story.highlights.${key}.value`)}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-cream/10 bg-noir/70 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('story.card.eyebrow')}
                </p>
                <h3 className="mt-3 text-2xl font-serif text-cream">
                  {t('story.card.title')}
                </h3>
                <p className="mt-2 text-sm text-cream/70">
                  {t('story.card.description')}
                </p>
              </div>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden border-y border-cream/10 py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(60,21,24,0.6),rgba(26,15,10,0.95))]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />
          <Container className="relative grid gap-8 lg:grid-cols-2">
            {[
              { key: 'mission', points: missionPoints },
              { key: 'vision', points: visionPoints }
            ].map((item, index) => (
              <Reveal key={item.key} delay={index * 150}>
                <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-noir/75 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                    {t(`${item.key}.eyebrow`)}
                  </p>
                  <h3 className="mt-3 text-2xl font-serif text-cream">
                    {t(`${item.key}.title`)}
                  </h3>
                  <p className="mt-4 text-sm text-cream/70">
                    {t(`${item.key}.description`)}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-cream/70">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 rounded-full bg-gold/70"
                          aria-hidden="true"
                        />
                        <span>{t(`${item.key}.points.${point}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section id="timeline" className="relative overflow-hidden py-20">
          <ParallaxOrb
            className="pointer-events-none absolute -right-28 top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl"
            speed={0.05}
          />
          <Container className="relative space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('timeline.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('timeline.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">
                {t('timeline.description')}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {timelineKeys.map((key, index) => (
                <Reveal key={key} delay={index * 120}>
                  <div className="rounded-2xl border border-cream/10 bg-[#140b08] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                      {t(`timeline.items.${key}.year`)}
                    </p>
                    <h3 className="mt-3 text-xl font-serif text-cream">
                      {t(`timeline.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-cream/70">
                      {t(`timeline.items.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-20">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('team.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('team.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('team.description')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamKeys.map((key, index) => (
                <Reveal key={key} delay={index * 110} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-6">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-espresso via-[#1c120d] to-noir">
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                    </div>
                    <h3 className="mt-4 text-lg font-serif text-cream">
                      {t(`team.members.${key}.name`)}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                      {t(`team.members.${key}.role`)}
                    </p>
                    <p className="mt-3 text-sm text-cream/70">
                      {t(`team.members.${key}.bio`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="rounded-3xl border border-cream/10 bg-noir/70 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                {t('team.quote.eyebrow')}
              </p>
              <p className="mt-4 text-xl font-serif text-cream">
                &ldquo;{t('team.quote.text')}&rdquo;
              </p>
              <p className="mt-3 text-sm text-cream/60">{t('team.quote.author')}</p>
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
