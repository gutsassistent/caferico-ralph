import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductTabs from '@/components/ProductTabs';
import Reveal from '@/components/Reveal';
import { getProduct, getProductsByIds } from '@/lib/woocommerce';
import { mapWooProduct, isCoffee } from '@/types/product';
import type { Product } from '@/types/product';
import mockProductsJson from '@/data/mock-products.json';
import { generatePageMetadata } from '@/lib/seo';

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let name = slug;
  try {
    const wc = await getProduct(slug);
    if (wc) name = wc.name;
  } catch {
    const mock = (mockProductsJson as Array<Record<string, unknown>>).find((p) => p.slug === slug);
    if (mock) name = mock.name as string;
  }
  return generatePageMetadata({
    locale,
    page: 'product',
    path: `shop/${slug}`,
    titleValues: { name },
    descriptionValues: { name },
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const t = await getTranslations('Product');

  let product: Product | null = null;

  try {
    const wcProduct = await getProduct(slug);
    if (wcProduct) {
      product = mapWooProduct(wcProduct);
    }
  } catch {
    // WooCommerce unavailable, fall through to mock data
  }

  // Fallback to mock data
  if (!product) {
    const mockMatch = (mockProductsJson as Array<Record<string, unknown>>).find(
      (p) => p.slug === slug
    );
    if (mockMatch) {
      product = mockMatch as unknown as Product;
    }
  }

  if (!product) {
    notFound();
  }

  // Fetch grouped children and related products in parallel
  let relatedProducts: Product[] = [];
  try {
    const [groupedChildren, relatedWc] = await Promise.all([
      product.type === 'grouped' && product.grouped_products.length > 0
        ? getProductsByIds(product.grouped_products)
        : Promise.resolve([]),
      product.related_ids.length > 0
        ? getProductsByIds(product.related_ids.slice(0, 4))
        : Promise.resolve([])
    ]);

    if (groupedChildren.length > 0) {
      product.grouped_children = groupedChildren.map((wc) => ({
        id: wc.id,
        name: wc.name,
        slug: wc.slug,
        price: parseFloat(wc.price) || 0,
        regular_price: parseFloat(wc.regular_price) || 0,
        images: wc.images
      }));
    }

    relatedProducts = relatedWc.map(mapWooProduct);
  } catch {
    // WooCommerce unavailable — use mock related products
    if (product.related_ids.length > 0) {
      const mockAll = mockProductsJson as unknown as Product[];
      relatedProducts = mockAll.filter((p) =>
        product.related_ids.includes(p.id)
      ).slice(0, 4);
    }
  }

  const priceFormatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  });

  const coffeeProduct = isCoffee(product.collection);

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
              <ProductImageGallery
                images={product.images.map((img) => ({
                  id: img.id,
                  src: img.src,
                  alt: img.alt || product.name
                }))}
                productName={product.name}
                badge={t('badge')}
              />
              <ProductTabs
                description={product.description || t('description', { origin: product.origin, notes: product.notes })}
                notes={product.notes || ''}
                origin={product.origin || ''}
                isCoffee={coffeeProduct}
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {product.categories[0]?.name ?? product.collection}
                </p>
                <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
                {product.short_description && (
                  <div
                    className="text-sm text-cream/60"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                )}
                {product.grouped_children.length > 0 ? (
                  <p className="text-3xl font-serif text-gold">
                    {priceFormatter.format(
                      Math.min(...product.grouped_children.map((c) => c.price))
                    )}
                    {' – '}
                    {priceFormatter.format(
                      Math.max(...product.grouped_children.map((c) => c.price))
                    )}
                  </p>
                ) : (
                  <p className="text-3xl font-serif text-gold">{priceFormatter.format(product.price)}</p>
                )}
              </div>
              {product.description ? (
                <div
                  className="prose prose-sm prose-invert max-w-none text-cream/70"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-sm text-cream/70 sm:text-base">
                  {t('description', { origin: product.origin, notes: product.notes })}
                </p>
              )}
              <ProductPurchasePanel
                product={{
                  id: String(product.id),
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  type: product.type,
                  collection: product.collection,
                  groupedChildren: product.grouped_children
                }}
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
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
                      collection: product.categories[0]?.name ?? product.collection
                    })}
                  </h2>
                  <p className="text-sm text-cream/70 sm:text-base">{t('related.description')}</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
                >
                  {t('related.cta')}
                  <span aria-hidden="true">&rarr;</span>
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
                        {item.images?.[0]?.src ? (
                          <img
                            src={item.images[0].src}
                            alt={item.images[0].alt || item.name}
                            className="absolute inset-0 h-full w-full object-cover"
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
                          {item.categories[0]?.name ?? item.collection}
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
      )}
    </main>
  );
}
