import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import HeroParallax from '@/components/HeroParallax';
import { getProducts } from '@/lib/woocommerce';
import { mapWooProduct } from '@/types/product';

export const revalidate = 3600;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('Home');

  // Single API call — fetch first 4 products (avoids double call when none are featured)
  const wcProducts = await getProducts({ per_page: '4' });
  const featuredProducts = wcProducts.map(mapWooProduct);

  const priceFormatter = new Intl.NumberFormat(locale || 'nl', {
    style: 'currency',
    currency: 'EUR'
  });

  return (
    <main className="min-h-screen bg-noir text-cream">
      <HeroParallax
        imageUrl="https://www.caferico.be/wp-content/uploads/2025/05/DSCF3617.jpg"
        imageAlt="Honduras coffee landscape"
      >
        <Container className="py-24">
          <div className="max-w-2xl space-y-8">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">{t('eyebrow')}</p>
            <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              {t('title')}
            </h1>
            <p className="text-lg text-cream/90 sm:text-xl">{t('description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(201,169,98,0.3)]"
              >
                {t('ctaPrimary')}
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-cream/40 px-8 py-4 text-xs uppercase tracking-[0.3em] text-cream transition hover:border-cream hover:bg-cream/10"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {(['bio', 'fairTrade', 'customers'] as const).map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-noir/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/80 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {t(`trustBadges.${badge}`)}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </HeroParallax>

      <Reveal>
        <section className="py-20">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('featured.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">{t('featured.title')}</h2>
                <p className="text-sm text-cream/70 sm:text-base">{t('featured.description')}</p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
              >
                {t('featured.cta')}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={index * 120} className="h-full">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                      {product.images?.[0]?.src ? (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                        </>
                      )}
                      <div className="absolute bottom-4 left-4 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                        {product.categories[0]?.name ?? product.collection}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-noir/0 transition-colors duration-300 group-hover:bg-noir/40">
                        <span className="translate-y-4 rounded-full bg-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-noir opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {t('featured.quickAdd')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex-1">
                      <h3 className="font-serif text-lg text-cream">{product.name}</h3>
                      <p className="mt-2 text-sm text-cream/60">
                        {product.notes || t('featured.detail')}
                      </p>
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
              <h2 className="font-serif text-3xl sm:text-4xl">{t('subscription.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('subscription.description')}</p>
              <Link
                href="/subscriptions"
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
              <h2 className="font-serif text-3xl sm:text-4xl">{t('values.title')}</h2>
              <p className="text-sm text-cream/70 sm:text-base">{t('values.description')}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {['fresh', 'fair', 'belgian', 'craft'].map((key, index) => (
                <Reveal key={key} delay={index * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-xs uppercase tracking-[0.3em] text-gold">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 font-serif text-lg text-cream">
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
