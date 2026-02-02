import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import SubscriptionTierCard from '@/components/SubscriptionTierCard';
import SubscriptionFaq from '@/components/SubscriptionFaq';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

type SubscriptionsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SubscriptionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'subscriptions', path: 'subscriptions' });
}

const benefitKeys = ['flexible', 'cheaper', 'fresh'] as const;

const benefitIcons = [
  // Flexible - refresh/cycle icon
  <svg key="flex" width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gold">
    <path d="M17.657 18.657A8 8 0 016.343 7.343M17.657 18.657L12 12m5.657 6.657L20 20M6.343 7.343L4 4m2.343 3.343L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Cheaper - tag/percentage icon
  <svg key="cheap" width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gold">
    <path d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Fresh - coffee/steam icon
  <svg key="fresh" width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gold">
    <path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

const tierGroups = [
  {
    id: 'beans' as const,
    tiers: [
      { key: 'starter', price: 6.5, originalPrice: 7.65, discount: 15, featured: false },
      { key: 'signature', price: 12.5, originalPrice: 14.71, discount: 15, featured: true },
      { key: 'atelier', price: 22.9, originalPrice: 26.94, discount: 15, featured: false }
    ]
  },
  {
    id: 'ground' as const,
    tiers: [
      { key: 'starter', price: 6.5, originalPrice: 7.65, discount: 15, featured: false },
      { key: 'signature', price: 12.5, originalPrice: 14.71, discount: 15, featured: true },
      { key: 'atelier', price: 22.9, originalPrice: 26.94, discount: 15, featured: false }
    ]
  }
];

const stepKeys = ['one', 'two', 'three'] as const;

export default async function SubscriptionsPage({ params }: SubscriptionsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('Subscriptions');
  const priceFormatter = new Intl.NumberFormat(locale || 'nl', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const subsBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: 'Subscriptions', url: `https://caferico.be/${locale}/subscriptions` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(subsBreadcrumb) }}
      />
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <Image
          src="/images/DSCF0031-scaled.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(26,15,10,0.92),rgba(60,21,24,0.88),rgba(26,15,10,0.95))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl" />

        <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('hero.eyebrow')}</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-cream/70 sm:text-base">{t('hero.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/subscriptions#tiers"
                className="rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('hero.primaryCta')}
              </Link>
              <Link
                href="/subscriptions#faq"
                className="rounded-full border border-cream/30 px-6 py-3 text-xs uppercase tracking-[0.3em] text-cream/80 transition hover:border-cream/60 hover:text-cream"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cream/10 bg-noir/70 px-4 py-2 text-xs uppercase tracking-[0.4em] text-cream/60">
              <span className="h-2 w-2 rounded-full bg-gold/80" aria-hidden="true" />
              {t('hero.badge')}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-espresso via-surface-mid to-noir p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
              <div className="relative flex flex-col items-center space-y-4">
                <div className="relative mx-auto h-48 w-36 sm:h-56 sm:w-44">
                  <Image
                    src="https://www.caferico.be/wp-content/uploads/2024/10/bonen_500.png"
                    alt="Café RICO koffiebonen 500g"
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    sizes="(max-width: 640px) 144px, 176px"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('hero.card.eyebrow')}
                </p>
                <h2 className="font-serif text-2xl text-cream">{t('hero.card.title')}</h2>
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
        <section id="tiers" className="section-light py-16 sm:py-24">
          <Container className="space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('tiers.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('tiers.title')}</h2>
              <p className="text-sm text-ink/70 sm:text-base">{t('tiers.description')}</p>
            </div>

            {tierGroups.map((group) => (
              <div key={group.id} className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                      {t(`tiers.${group.id}.eyebrow`)}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl">
                      {t(`tiers.${group.id}.title`)}
                    </h3>
                    <p className="text-sm text-ink/70 sm:text-base">
                      {t(`tiers.${group.id}.description`)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                  {group.tiers.map((tier, index) => (
                    <SubscriptionTierCard
                      key={tier.key}
                      groupId={group.id}
                      tier={tier}
                      index={index}
                      priceFormatted={priceFormatter.format(tier.price)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden border-y border-cream/10 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(60,21,24,0.65),rgba(26,15,10,0.95))]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />

          <Container className="relative">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('steps.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('steps.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('steps.description')}</p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-0">
              {stepKeys.map((stepKey, index) => (
                <Reveal key={stepKey} delay={index * 120}>
                  <div className="relative flex flex-col items-center text-center">
                    {/* Arrow between steps (desktop only) */}
                    {index < 2 && (
                      <div className="pointer-events-none absolute right-0 top-10 hidden translate-x-1/2 md:block">
                        <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="text-gold/40">
                          <path d="M0 6h36m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}

                    {/* Icon circle */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                      {index === 0 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold">
                          <path d="M17.657 18.657A8 8 0 016.343 7.343M17.657 18.657L12 12m5.657 6.657L20 20M6.343 7.343L4 4m2.343 3.343L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold">
                          <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Step number */}
                    <span className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold/50">
                      {index + 1}
                    </span>

                    {/* Title & description */}
                    <h3 className="mt-2 font-serif text-lg text-cream">
                      {t(`steps.items.${stepKey}.title`)}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-cream/70">
                      {t(`steps.items.${stepKey}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bottom card */}
            <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-cream/10 bg-noir/70 p-8 text-center shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('steps.card.eyebrow')}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-cream">{t('steps.card.title')}</h3>
              <p className="mt-3 text-sm text-cream/70">{t('steps.card.description')}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/70">
                {t('steps.card.detail')}
              </p>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section id="faq" className="section-light py-16 sm:py-24">
          <Container>
            <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              {/* Left: header + benefits */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('faq.eyebrow')}</p>
                  <h2 className="font-serif text-3xl sm:text-4xl">{t('faq.title')}</h2>
                  <p className="text-sm text-ink/70 sm:text-base">{t('faq.description')}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold/50">{t('benefits.eyebrow')}</p>
                  {benefitKeys.map((key, index) => (
                    <Reveal key={key} delay={index * 100}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                          {benefitIcons[index]}
                        </div>
                        <div>
                          <h3 className="font-serif text-base text-ink">{t(`benefits.items.${key}.title`)}</h3>
                          <p className="mt-1 text-sm text-ink/60">{t(`benefits.items.${key}.description`)}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Right: accordion FAQ */}
              <SubscriptionFaq />
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-25" />

          <Container className="relative">
            <div className="rounded-3xl border border-cream/10 bg-noir/70 px-8 py-12 text-center shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('cta.eyebrow')}</p>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{t('cta.title')}</h2>
              <p className="mt-3 text-sm text-cream/70 sm:text-base">{t('cta.description')}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/subscriptions#tiers"
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
