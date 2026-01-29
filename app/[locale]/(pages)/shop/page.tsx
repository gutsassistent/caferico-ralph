import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import ShopCatalog from '@/components/ShopCatalog';
import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { mapWooProduct } from '@/types/product';
import type { Product } from '@/types/product';
import mockProductData from '@/data/mock-products.json';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'shop', path: 'shop' });
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Shop');

  let products: Product[] = [];
  let categories: { id: number; name: string; slug: string }[] = [];

  try {
    const [wcProducts, wcCategories] = await Promise.all([getProducts(), getProductCategories()]);

    // Collect all child IDs of grouped products so we can exclude them from the listing
    const groupedChildIds = new Set(
      wcProducts.filter((p) => p.type === 'grouped').flatMap((p) => p.grouped_products ?? [])
    );

    products = wcProducts
      .filter((p) => !groupedChildIds.has(p.id))
      .filter((p) => {
        const cats = p.categories.map((c) => c.slug);
        return !(cats.length === 1 && cats[0] === 'geen-categorie');
      })
      .map(mapWooProduct);

    categories = wcCategories
      .filter((c) => c.slug !== 'geen-categorie')
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  } catch {
    // API unavailable — silently fall through to mock data
  }

  // Fallback to mock data when API returns no products
  if (products.length === 0) {
    products = mockProductData as Product[];
    const catSet = new Map<string, { id: number; name: string; slug: string }>();
    for (const p of products) {
      for (const c of p.categories) {
        if (!catSet.has(c.slug)) catSet.set(c.slug, c);
      }
    }
    categories = Array.from(catSet.values());
  }

  const shopBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: 'Shop', url: `https://caferico.be/${locale}/shop` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(shopBreadcrumb) }}
      />
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/40 blur-3xl" />

        <Container className="relative py-20">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('hero.eyebrow')}</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{t('hero.title')}</h1>
            <p className="text-sm text-cream/70 sm:text-base">{t('hero.description')}</p>
          </div>
        </Container>
      </section>

      <Reveal>
        <section className="py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('intro.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">{t('intro.title')}</h2>
                <p className="text-sm text-cream/70 sm:text-base">{t('intro.description')}</p>
              </div>
              <div className="rounded-full border border-cream/10 bg-noir/70 px-5 py-3 text-xs uppercase tracking-[0.3em] text-cream/60">
                {t('intro.badge')}
              </div>
            </div>

            <ShopCatalog products={products} categories={categories} />
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
