import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';

type SubscriptionsPageProps = {
  params: { locale: string };
};

const tierGroups = [
  {
    id: 'beans',
    tiers: [
      { key: 'starter', price: 18, featured: false },
      { key: 'signature', price: 29, featured: true },
      { key: 'atelier', price: 46, featured: false }
    ]
  },
  {
    id: 'ground',
    tiers: [
      { key: 'starter', price: 17, featured: false },
      { key: 'signature', price: 27, featured: true },
      { key: 'atelier', price: 42, featured: false }
    ]
  }
] as const;

const benefitKeys = ['one', 'two', 'three'] as const;
const stepKeys = ['one', 'two', 'three'] as const;
const faqKeys = ['one', 'two', 'three', 'four'] as const;

export default async function SubscriptionsPage({ params }: SubscriptionsPageProps) {
  const t = await getTranslations('Subscriptions');
  const locale = params.locale;
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl" />

        <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('hero.eyebrow')}</p>
            <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-cream/70 sm:text-base">{t('hero.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/subscriptions#tiers`}
                className="rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('hero.primaryCta')}
              </Link>
              <Link
                href={`/${locale}/subscriptions#faq`}
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
            <div className="relative overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-espresso via-[#1c120d] to-noir p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
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
        <section id="tiers" className="py-20">
          <Container className="space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('tiers.eyebrow')}</p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('tiers.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('tiers.description')}</p>
            </div>

            {tierGroups.map((group) => (
              <div key={group.id} className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                      {t(`tiers.${group.id}.eyebrow`)}
                    </p>
                    <h3 className="text-2xl font-serif sm:text-3xl">
                      {t(`tiers.${group.id}.title`)}
                    </h3>
                    <p className="text-sm text-cream/70 sm:text-base">
                      {t(`tiers.${group.id}.description`)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {group.tiers.map((tier, index) => {
                    const cardClassName = `group relative flex h-full flex-col overflow-hidden rounded-3xl border transition duration-300 ${
                      tier.featured
                        ? 'border-gold/60 bg-[linear-gradient(135deg,rgba(60,21,24,0.95),rgba(26,15,10,0.92))] shadow-[0_35px_70px_rgba(0,0,0,0.5)]'
                        : 'border-cream/10 bg-[#140b08] hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]'
                    }`;

                    return (
                      <Reveal key={tier.key} delay={index * 120} className="h-full">
                        <div className={cardClassName}>
                          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-30" />
                          {tier.featured ? (
                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
                          ) : null}
                          <div className="relative flex h-full flex-col gap-6 p-6">
                            {tier.featured ? (
                              <span className="inline-flex items-center self-start rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
                                {t(`tiers.${group.id}.${tier.key}.badge`)}
                              </span>
                            ) : null}
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                                {t(`tiers.${group.id}.${tier.key}.size`)}
                              </p>
                              <h4 className="mt-3 text-2xl font-serif text-cream">
                                {t(`tiers.${group.id}.${tier.key}.title`)}
                              </h4>
                              <p className="mt-2 text-sm text-cream/70">
                                {t(`tiers.${group.id}.${tier.key}.description`)}
                              </p>
                            </div>
                            <div className="mt-auto space-y-4">
                              <p className="text-3xl font-serif text-cream">
                                {t('tiers.priceLabel', {
                                  price: priceFormatter.format(tier.price)
                                })}
                              </p>
                              <ul className="space-y-2 text-sm text-cream/70">
                                {benefitKeys.map((benefitKey) => (
                                  <li key={benefitKey} className="flex items-start gap-3">
                                    <span
                                      className="mt-2 h-1.5 w-1.5 rounded-full bg-gold/70"
                                      aria-hidden="true"
                                    />
                                    <span>
                                      {t(
                                        `tiers.${group.id}.${tier.key}.benefits.${benefitKey}`
                                      )}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <button
                                type="button"
                                className={`w-full rounded-full border px-5 py-3 text-xs uppercase tracking-[0.3em] transition ${
                                  tier.featured
                                    ? 'border-gold/60 bg-gold/20 text-gold hover:bg-gold hover:text-noir'
                                    : 'border-cream/20 text-cream/80 hover:border-gold/60 hover:text-gold'
                                }`}
                              >
                                {t('tiers.cta')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden border-y border-cream/10 py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(60,21,24,0.65),rgba(26,15,10,0.95))]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />

          <Container className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('steps.eyebrow')}</p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('steps.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('steps.description')}</p>
              <div className="space-y-6">
                {stepKeys.map((stepKey, index) => (
                  <div key={stepKey} className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-xs font-semibold text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                        {t(`steps.items.${stepKey}.title`)}
                      </p>
                      <p className="mt-2 text-sm text-cream/70">
                        {t(`steps.items.${stepKey}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cream/10 bg-noir/70 p-8 shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('steps.card.eyebrow')}
              </p>
              <h3 className="mt-4 text-2xl font-serif text-cream">{t('steps.card.title')}</h3>
              <p className="mt-3 text-sm text-cream/70">{t('steps.card.description')}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/70">
                {t('steps.card.detail')}
              </p>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section id="faq" className="py-20">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('faq.eyebrow')}</p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('faq.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('faq.description')}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {faqKeys.map((faqKey, index) => (
                <Reveal key={faqKey} delay={index * 90} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-6">
                    <h3 className="text-lg font-serif text-cream">
                      {t(`faq.items.${faqKey}.question`)}
                    </h3>
                    <p className="mt-3 text-sm text-cream/70">
                      {t(`faq.items.${faqKey}.answer`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />

          <Container className="relative">
            <div className="rounded-3xl border border-cream/10 bg-noir/70 px-8 py-12 text-center shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('cta.eyebrow')}</p>
              <h2 className="mt-4 text-3xl font-serif sm:text-4xl">{t('cta.title')}</h2>
              <p className="mt-3 text-sm text-cream/70 sm:text-base">{t('cta.description')}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/subscriptions#tiers`}
                  className="rounded-full border border-gold/60 px-7 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
                >
                  {t('cta.button')}
                </Link>
                <span className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('cta.note')}
                </span>
              </div>
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
