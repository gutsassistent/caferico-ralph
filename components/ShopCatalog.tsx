'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Reveal from '@/components/Reveal';
import type { Product } from '@/types/product';
import { resolveCollection } from '@/types/product';

/** Get all lowercased attribute options for a product, searching by attribute name */
function getProductAttr(product: Product, attrName: string): string[] {
  const attr = product.attributes?.find(
    (a) => a.name.toLowerCase() === attrName.toLowerCase()
  );
  return attr?.options.map((o) => o.toLowerCase()) ?? [];
}

/** Check if a product matches any value in a filter set, searching across multiple attribute names */
function matchesFilter(product: Product, attrNames: string[], filterValues: Set<string>): boolean {
  for (const name of attrNames) {
    const options = getProductAttr(product, name);
    for (const val of filterValues) {
      if (options.some((o) => o.includes(val.toLowerCase()))) return true;
    }
  }
  return false;
}

type SortOption = 'price-asc' | 'price-desc' | 'name-asc';

type CollectionFilter = string;

type ShopCatalogProps = {
  products: Product[];
  categories: { id: number; name: string; slug: string }[];
};

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-surface-darker p-5">
      <div className="relative aspect-[4/3] animate-pulse overflow-hidden rounded-2xl bg-espresso/50" />
      <div className="mt-4 flex-1 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-cream/10" />
        <div className="h-4 w-full animate-pulse rounded bg-cream/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-cream/5" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-12 animate-pulse rounded bg-cream/10" />
        <div className="h-4 w-16 animate-pulse rounded bg-gold/20" />
      </div>
      <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-cream/5" />
    </div>
  );
}

/* ── Custom checkbox ─────────────────────────────────────────────── */
function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-sm text-cream/80 transition hover:text-cream">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-gold bg-gold text-noir'
            : 'border-cream/20 bg-noir/60'
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

/* ── Filter section accordion ────────────────────────────────────── */
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-cream/10 py-4 first:pt-0 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.3em] text-cream/60 transition hover:text-cream"
      >
        {title}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all ${
          open ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ShopCatalog({ products, categories }: ShopCatalogProps) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<CollectionFilter>('all');
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [isLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* Filter state for type, format, and form */
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

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

    if (selectedTypes.size > 0) {
      result = result.filter((p) => matchesFilter(p, ['type', 'soort', 'profiel'], selectedTypes));
    }
    if (selectedFormats.size > 0) {
      result = result.filter((p) => matchesFilter(p, ['weight', 'gewicht', 'formaat', 'format'], selectedFormats));
    }
    if (selectedForms.size > 0) {
      result = result.filter((p) => matchesFilter(p, ['form', 'vorm', 'grind', 'maalgraad'], selectedForms));
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
  }, [products, collection, locale, normalizedQuery, sort, selectedTypes, selectedFormats, selectedForms]);

  const availableCollections = useMemo(() => {
    const collectionSet = new Set(products.map((p) => p.collection));
    return Array.from(collectionSet);
  }, [products]);

  const activeFilterCount =
    selectedTypes.size + selectedFormats.size + selectedForms.size +
    (collection !== 'all' ? 1 : 0) +
    (query ? 1 : 0);

  const handleReset = () => {
    setQuery('');
    setCollection('all');
    setSort('price-asc');
    setSelectedTypes(new Set());
    setSelectedFormats(new Set());
    setSelectedForms(new Set());
  };

  /* ── Filter sidebar content (reused in desktop sidebar + mobile drawer) ── */
  const filterContent = (
    <>
      {/* Search */}
      <div className="space-y-2 pb-4">
        <label
          htmlFor="shop-search"
          className="text-xs uppercase tracking-[0.3em] text-cream/60"
        >
          {t('filters.searchLabel')}
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full rounded-2xl border border-cream/10 bg-noir/80 py-3 pl-10 pr-4 text-sm text-cream placeholder:text-cream/50 focus:border-gold/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Type */}
      <FilterSection title={t('sidebar.typeTitle')}>
        <div className="space-y-1">
          {['mild', 'intens', 'espresso', 'decaf'].map((type) => (
            <FilterCheckbox
              key={type}
              label={t(`sidebar.types.${type}`)}
              checked={selectedTypes.has(type)}
              onChange={() => setSelectedTypes(toggleSet(selectedTypes, type))}
            />
          ))}
        </div>
      </FilterSection>

      {/* Formaat */}
      <FilterSection title={t('sidebar.formatTitle')}>
        <div className="space-y-1">
          {['250g', '500g'].map((fmt) => (
            <FilterCheckbox
              key={fmt}
              label={fmt}
              checked={selectedFormats.has(fmt)}
              onChange={() => setSelectedFormats(toggleSet(selectedFormats, fmt))}
            />
          ))}
        </div>
      </FilterSection>

      {/* Vorm */}
      <FilterSection title={t('sidebar.formTitle')}>
        <div className="space-y-1">
          {['beans', 'ground'].map((form) => (
            <FilterCheckbox
              key={form}
              label={t(`sidebar.forms.${form}`)}
              checked={selectedForms.has(form)}
              onChange={() => setSelectedForms(toggleSet(selectedForms, form))}
            />
          ))}
        </div>
      </FilterSection>

      {/* Collection (existing) */}
      <FilterSection title={t('filters.collectionLabel')}>
        <div className="space-y-1">
          <FilterCheckbox
            label={t('filters.allCollections')}
            checked={collection === 'all'}
            onChange={() => setCollection('all')}
          />
          {availableCollections.map((id) => {
            const cat = categories.find((c) => c.slug === id || resolveCollection(c.slug) === id);
            return (
              <FilterCheckbox
                key={id}
                label={cat?.name ?? id}
                checked={collection === id}
                onChange={() => setCollection(id)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title={t('filters.sortLabel')}>
        <div className="space-y-1">
          {(['price-asc', 'price-desc', 'name-asc'] as SortOption[]).map((option) => (
            <FilterCheckbox
              key={option}
              label={t(`filters.sort.${option === 'price-asc' ? 'priceAsc' : option === 'price-desc' ? 'priceDesc' : 'nameAsc'}`)}
              checked={sort === option}
              onChange={() => setSort(option)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Reset + Show results */}
      <div className="space-y-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-full border border-cream/20 py-2.5 text-xs uppercase tracking-[0.3em] text-cream/60 transition hover:border-cream/40 hover:text-cream"
        >
          {t('sidebar.reset')}
        </button>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(false)}
          className="w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90"
        >
          {t('sidebar.showResults', { count: filteredProducts.length })}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      {/* ── Mobile filter toggle ───────────────────────────────────── */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border border-cream/20 px-5 py-2.5 text-xs uppercase tracking-[0.3em] text-cream/70 transition hover:border-gold/50 hover:text-cream"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="16" y2="12" />
            <line x1="4" y1="18" x2="12" y2="18" />
          </svg>
          {t('sidebar.filterButton')}
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-noir">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-cream/50">
          {t('results.count', { count: filteredProducts.length })}
        </p>
      </div>

      {/* ── Mobile filter drawer (overlay) ─────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-noir/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-cream/10 bg-surface-darkest p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-lg text-cream">{t('sidebar.filterButton')}</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition hover:text-cream"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-28 rounded-3xl border border-cream/10 bg-surface-darkest/80 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
          {filterContent}
        </div>
      </aside>

      {/* ── Product grid ───────────────────────────────────────────── */}
      <div className="flex-1 space-y-6">
        {/* Results bar (desktop) */}
        <div className="hidden items-center justify-between lg:flex">
          <p className="text-sm text-cream/60">
            {t('results.count', { count: filteredProducts.length })}
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('results.subtitle')}</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-cream/10 bg-surface-darkest/80 p-10 text-center">
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
                  className="group flex h-full flex-col rounded-3xl border border-cream/10 bg-surface-darker p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-espresso via-surface-mid to-noir">
                    {product.images?.[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.2),_transparent_60%)]" />
                      </>
                    )}
                    {product.on_sale && (
                      <div className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-noir">
                        {t('card.saleBadge')}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cream/70">
                      {product.categories[0]?.name ?? product.collection}
                    </div>
                  </div>
                  <div className="mt-4 flex-1 space-y-2">
                    <h3 className="font-serif text-lg text-cream">{product.name}</h3>
                    <p className="text-sm text-cream/60">{product.notes}</p>
                    {product.origin && (
                      <p className="text-xs text-cream/60">
                        <span className="uppercase tracking-[0.3em] text-cream/60">
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
                  <div className="mt-4 flex items-center justify-center rounded-full border border-gold/40 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-noir">
                    {t('card.addToCart')}
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


