import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import HeroParallax from '@/components/HeroParallax';
import NewsletterForm from '@/components/NewsletterForm';
import { getProducts } from '@/lib/woocommerce';
import { mapWooProduct } from '@/types/product';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

export const revalidate = 3600;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'home' });
}

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

  const homeBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeBreadcrumb) }}
      />
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
        <section className="section-light py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('featured.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">{t('featured.title')}</h2>
                <p className="text-sm text-ink/70 sm:text-base">{t('featured.description')}</p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-ink"
              >
                {t('featured.cta')}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={index * 120} className="h-full">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white/60 p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-espresso via-surface-mid to-noir">
                      {product.images?.[0]?.src ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                        </>
                      )}
                      <div className="absolute bottom-4 left-4 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cream/70">
                        {product.categories[0]?.name ?? product.collection}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-noir/0 transition-colors duration-300 group-hover:bg-noir/40">
                        <span className="translate-y-4 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-noir opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {t('featured.quickAdd')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex-1">
                      <h3 className="font-serif text-lg text-ink">{product.name}</h3>
                      <p className="mt-2 text-sm text-ink/60">
                        {product.notes || t('featured.detail')}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-ink/60">{t('featured.priceLabel')}</span>
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
        <section className="relative overflow-hidden bg-espresso py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.08),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-20" />
          <Container className="relative text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
              {t('subscription.eyebrow')}
            </p>
            <h2 className="mx-auto mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
              {t('subscription.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-cream/70 sm:text-base">
              {t('subscription.description')}
            </p>

            <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
              {(['discount', 'shipping', 'flexible'] as const).map((key) => (
                <div key={key} className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-noir/40">
                    {key === 'discount' && (
                      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                      </svg>
                    )}
                    {key === 'shipping' && (
                      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    )}
                    {key === 'flexible' && (
                      <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-cream">
                    {t(`subscription.benefits.${key}`)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 max-w-xs">
              <Image
                src="https://www.caferico.be/wp-content/uploads/2024/10/bonen_500.png"
                alt="Caférico coffee package"
                width={300}
                height={400}
                className="mx-auto h-48 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:h-56"
              />
            </div>

            <div className="mt-10">
              <Link
                href="/subscriptions"
                className="inline-flex rounded-full bg-gold px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(201,169,98,0.3)]"
              >
                {t('subscription.cta')}
              </Link>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-light py-16 sm:py-24">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1 space-y-6">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('ourStory.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
                  {t('ourStory.title')}
                </h2>
                <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
                  {t('ourStory.description')}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-ink"
                >
                  {t('ourStory.cta')}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
              <div className="order-1 lg:order-2 relative h-72 overflow-hidden rounded-2xl sm:h-96 lg:h-[480px]">
                <Image
                  src="https://www.caferico.be/wp-content/uploads/2018/05/koffieboer-4-Copy-1000×536.jpg"
                  alt="Koffieboer in Honduras"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface-deep py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('testimonials.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('testimonials.title')}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {(['tom', 'lesly', 'joke'] as const).map((key, index) => (
                <Reveal key={key} delay={index * 120} className="h-full">
                  <blockquote className="flex h-full flex-col rounded-2xl border border-cream/10 bg-surface-darker p-6 sm:p-8">
                    <svg className="mb-4 h-8 w-8 text-gold/40" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179zM15.583 17.321C14.553 16.227 14 15 14 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C20.591 11.69 22 13.166 22 15c0 1.933-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179z" />
                    </svg>
                    <p className="flex-1 text-sm leading-relaxed text-cream/80 sm:text-base">
                      {t(`testimonials.items.${key}.quote`)}
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-cream/10 pt-6">
                      {key === 'tom' && (
                        <Image
                          src="https://www.caferico.be/wp-content/uploads/2018/05/Tom-Janssens.jpg"
                          alt={t(`testimonials.items.${key}.name`)}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      {key !== 'tom' && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-noir text-sm font-semibold text-gold">
                          {t(`testimonials.items.${key}.name`).charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-cream">
                          {t(`testimonials.items.${key}.name`)}
                        </p>
                        <p className="text-xs text-cream/50">
                          {t(`testimonials.items.${key}.role`)}
                        </p>
                      </div>
                    </div>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-light py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('values.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('values.title')}</h2>
              <p className="text-sm text-ink/70 sm:text-base">{t('values.description')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {['fresh', 'fair', 'belgian', 'craft'].map((key, index) => (
                <Reveal key={key} delay={index * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white/60 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-xs uppercase tracking-[0.3em] text-gold">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 font-serif text-lg text-ink">
                      {t(`values.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-ink/70">
                      {t(`values.items.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden bg-espresso py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.06),transparent_60%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('newsletter.eyebrow')}
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                {t('newsletter.title')}
              </h2>
              <p className="mt-2 text-lg text-gold/90 sm:text-xl">
                {t('newsletter.subtitle')}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm text-cream/60">
                {t('newsletter.description')}
              </p>
              <div className="relative mx-auto mt-8 max-w-lg">
                <NewsletterForm
                  placeholder={t('newsletter.placeholder')}
                  buttonText={t('newsletter.button')}
                  loadingText={t('newsletter.loading')}
                  successText={t('newsletter.success')}
                  errorText={t('newsletter.error')}
                  duplicateText={t('newsletter.duplicate')}
                  rateLimitedText={t('newsletter.rateLimited')}
                />
              </div>
              <p className="mt-4 text-xs text-cream/60">
                {t('newsletter.privacy')}
              </p>
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
