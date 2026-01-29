'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Reveal from '@/components/Reveal';
import type { Product } from '@/types/product';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc';

type CollectionFilter = string;

type ShopCatalogProps = {
  products: Product[];
  categories: { id: number; name: string; slug: string }[];
};

export default function ShopCatalog({ products, categories }: ShopCatalogProps) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<CollectionFilter>('all');
  const [sort, setSort] = useState<SortOption>('price-asc');

  const normalizedQuery = query.trim().toLowerCase();
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
      }),
    [locale]
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    if (collection !== 'all') {
      result = result.filter((product) => product.collection === collection);
    }

    if (normalizedQuery) {
      result = result.filter((product) => {
        const haystack = `${product.name} ${product.origin} ${product.notes}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    const sorted = [...result].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name, locale, { sensitivity: 'base' });
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, collection, locale, normalizedQuery, sort]);

  const availableCollections = useMemo(() => {
    const collectionSet = new Set(products.map((p) => p.collection));
    return Array.from(collectionSet);
  }, [products]);

  const handleReset = () => {
    setQuery('');
    setCollection('all');
    setSort('price-asc');
  };

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-cream/10 bg-[#120907]/80 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="space-y-2">
            <label
              htmlFor="shop-search"
              className="text-xs uppercase tracking-[0.3em] text-cream/60"
            >
              {t('filters.searchLabel')}
            </label>
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('filters.searchPlaceholder')}
              className="w-full rounded-2xl border border-cream/10 bg-noir/80 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold/60 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="collection-filter"
              className="text-xs uppercase tracking-[0.3em] text-cream/60"
            >
              {t('filters.collectionLabel')}
            </label>
            <select
              id="collection-filter"
              value={collection}
              onChange={(event) => setCollection(event.target.value)}
              className="w-full rounded-2xl border border-cream/10 bg-noir/80 px-4 py-3 text-sm text-cream focus:border-gold/60 focus:outline-none"
            >
              <option value="all" className="text-noir">
                {t('filters.allCollections')}
              </option>
              {availableCollections.map((id) => {
                const cat = categories.find((c) => c.slug === id || resolveCollection(c.slug) === id);
                return (
                  <option key={id} value={id} className="text-noir">
                    {cat?.name ?? id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="sort-filter"
              className="text-xs uppercase tracking-[0.3em] text-cream/60"
            >
              {t('filters.sortLabel')}
            </label>
            <select
              id="sort-filter"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="w-full rounded-2xl border border-cream/10 bg-noir/80 px-4 py-3 text-sm text-cream focus:border-gold/60 focus:outline-none"
            >
              <option value="price-asc" className="text-noir">
                {t('filters.sort.priceAsc')}
              </option>
              <option value="price-desc" className="text-noir">
                {t('filters.sort.priceDesc')}
              </option>
              <option value="name-asc" className="text-noir">
                {t('filters.sort.nameAsc')}
              </option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-cream/60">
          <p>{t('results.count', { count: filteredProducts.length })}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('results.subtitle')}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-cream/10 bg-[#120907]/80 p-10 text-center">
            <p className="font-serif text-lg text-cream">{t('empty.title')}</p>
            <p className="mt-3 text-sm text-cream/60">{t('empty.description')}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
            >
              {t('empty.cta')}
            </button>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 70} className="h-full">
              <Link
                href={`/shop/${product.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-cream/10 bg-[#140b08] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                  {product.images[0]?.src ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.2),_transparent_60%)]" />
                    </>
                  )}
                  <div className="absolute bottom-3 left-3 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                    {product.categories[0]?.name ?? product.collection}
                  </div>
                </div>
                <div className="mt-4 flex-1 space-y-2">
                  <h3 className="font-serif text-lg text-cream">{product.name}</h3>
                  <p className="text-sm text-cream/60">{product.notes}</p>
                  {product.origin && (
                    <p className="text-xs text-cream/60">
                      <span className="uppercase tracking-[0.3em] text-cream/40">
                        {t('card.originLabel')}
                      </span>
                      <span className="ml-2 text-cream/70">{product.origin}</span>
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-cream/50">{t('card.priceLabel')}</span>
                  <span className="text-gold">{priceFormatter.format(product.price)}</span>
                </div>
              </Link>
            </Reveal>
          ))
        )}
      </div>
    </div>
  );
}

function resolveCollection(slug: string): string {
  const map: Record<string, string> = {
    koffiebonen: 'beans',
    bonen: 'beans',
    beans: 'beans',
    gemalen: 'ground',
    ground: 'ground',
    accessoires: 'accessories',
    accessories: 'accessories',
  };
  return map[slug] ?? slug;
}
