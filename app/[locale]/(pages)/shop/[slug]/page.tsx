import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import Reveal from '@/components/Reveal';
import products from '@/data/products.json';

type Product = (typeof products)[number];

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const PRODUCT_LIST = products as Product[];

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const t = await getTranslations('Product');
  const shopT = await getTranslations('Shop');

  const product = PRODUCT_LIST.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCT_LIST.filter(
    (item) => item.collection === product.collection && item.id !== product.id
  ).slice(0, 4);

  const priceFormatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  });

  const detailItems = [
    { label: t('details.originLabel'), value: product.origin },
    { label: t('details.notesLabel'), value: product.notes },
    { label: t('details.collectionLabel'), value: shopT(`collections.${product.collection}`) },
    { label: t('details.roastLabel'), value: t('details.roastValue') }
  ];

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(26,15,10,0.95),rgba(60,21,24,0.88),rgba(26,15,10,0.96))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <Container className="relative py-10">
          <nav
            aria-label={t('breadcrumbs.label')}
            className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/60"
          >
            <Link href="/" className="transition hover:text-cream">
              {t('breadcrumbs.home')}
            </Link>
            <span className="text-cream/40">/</span>
            <Link href="/shop" className="transition hover:text-cream">
              {t('breadcrumbs.shop')}
            </Link>
            <span className="text-cream/40">/</span>
            <span className="text-cream/90">{product.name}</span>
          </nav>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-cream/10 bg-gradient-to-br from-espresso via-[#1f130d] to-noir shadow-[0_35px_70px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.35),_transparent_60%)]" />
                  <div className="absolute bottom-5 left-5 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                    {t('badge')}
                  </div>
                </div>
                <div className="grid gap-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={`thumb-${index}`}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-[#1c120d] via-[#120907] to-noir"
                    >
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.2),_transparent_65%)]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cream/10 bg-[#120907]/80 p-5 text-sm text-cream/70">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  {t('details.title')}
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {detailItems.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <dt className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
                        {item.label}
                      </dt>
                      <dd className="text-sm text-cream">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {shopT(`collections.${product.collection}`)}
                </p>
                <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
                <p className="text-sm text-cream/60">{product.notes}</p>
                <p className="text-2xl text-gold">{priceFormatter.format(product.price)}</p>
              </div>
              <p className="text-sm text-cream/70 sm:text-base">
                {t('description', { origin: product.origin, notes: product.notes })}
              </p>
              <ProductPurchasePanel
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  collection: product.collection
                }}
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <Reveal>
        <section className="border-t border-cream/10 py-16">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('related.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">
                  {t('related.title', {
                    collection: shopT(`collections.${product.collection}`)
                  })}
                </h2>
                <p className="text-sm text-cream/70 sm:text-base">{t('related.description')}</p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
              >
                {t('related.cta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <Reveal key={item.id} delay={index * 80} className="h-full">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                      <div className="absolute bottom-4 left-4 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                        {shopT(`collections.${item.collection}`)}
                      </div>
                    </div>
                    <div className="mt-4 flex-1">
                      <h3 className="font-serif text-lg text-cream">{item.name}</h3>
                      <p className="mt-2 text-sm text-cream/60">{item.notes}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-cream/60">{t('related.priceLabel')}</span>
                      <span className="text-gold">{priceFormatter.format(item.price)}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
