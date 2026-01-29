import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import products from '@/data/products.json';

type HomePageProps = {
  params: { locale: string };
};

export default async function HomePage({ params }: HomePageProps) {
  const t = await getTranslations('Home');
  const locale = params.locale;
  const featuredProducts = products.slice(0, 4);
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  });

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(26,15,10,0.95),rgba(60,21,24,0.88),rgba(26,15,10,0.96))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-glow" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-40" />
        <div className="pointer-events-none absolute -right-32 top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/50 blur-3xl" />

        <Container className="relative grid min-h-[70vh] gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="text-base text-cream/80 sm:text-lg">{t('description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/shop`}
                className="rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('ctaPrimary')}
              </Link>
              <Link
                href={`/${locale}/subscriptions`}
                className="rounded-full border border-cream/30 px-6 py-3 text-xs uppercase tracking-[0.3em] text-cream/80 transition hover:border-cream/60 hover:text-cream"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
            <div className="grid gap-4 pt-6 sm:grid-cols-2">
              {['roast', 'delivery'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cream/10 bg-[#140b08]/80 p-4 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                    {t(`highlights.${item}.title`)}
                  </p>
                  <p className="mt-2 text-sm text-cream/80">
                    {t(`highlights.${item}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-espresso via-[#1f130d] to-noir shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.3),_transparent_60%)]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-cream/10 bg-noir/70 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  {t('heroCard.eyebrow')}
                </p>
                <p className="mt-2 text-lg font-serif text-cream">{t('heroCard.title')}</p>
                <p className="mt-1 text-sm text-cream/70">{t('heroCard.description')}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Reveal>
        <section className="py-20">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('featured.eyebrow')}
                </p>
                <h2 className="text-3xl font-serif sm:text-4xl">{t('featured.title')}</h2>
                <p className="text-sm text-cream/70 sm:text-base">
                  {t('featured.description')}
                </p>
              </div>
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
              >
                {t('featured.cta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={index * 120} className="h-full">
                  <Link
                    href={`/${locale}/shop/${product.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                      <div className="absolute bottom-4 left-4 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                        {t(`collections.${product.collection}`)}
                      </div>
                    </div>
                    <div className="mt-4 flex-1">
                      <h3 className="text-lg font-serif text-cream">{product.name}</h3>
                      <p className="mt-2 text-sm text-cream/60">{t('featured.detail')}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-cream/60">{t('featured.priceLabel')}</span>
                      <span className="text-gold">{priceFormatter.format(product.price)}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(60,21,24,0.65),rgba(26,15,10,0.95))]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-30" />
          <Container className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('subscription.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('subscription.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">
                {t('subscription.description')}
              </p>
              <Link
                href={`/${locale}/subscriptions`}
                className="inline-flex items-center gap-3 rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('subscription.cta')}
              </Link>
            </div>
            <div className="rounded-3xl border border-cream/10 bg-noir/70 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('subscription.stepsTitle')}
              </p>
              <div className="mt-6 space-y-4">
                {['one', 'two', 'three'].map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-xs font-semibold text-gold">
                      {index + 1}
                    </span>
                    <p className="text-sm text-cream/70">{t(`subscription.steps.${step}`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-20">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('values.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">{t('values.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('values.description')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {['fresh', 'fair', 'belgian', 'craft'].map((key, index) => (
                <Reveal key={key} delay={index * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-xs uppercase tracking-[0.3em] text-gold">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-serif text-cream">
                      {t(`values.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-cream/70">
                      {t(`values.items.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
