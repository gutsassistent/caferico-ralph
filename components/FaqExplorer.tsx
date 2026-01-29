'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

const categoryKeys = [
  'all',
  'orders',
  'subscriptions',
  'products',
  'shipping',
  'returns'
] as const;

type CategoryKey = (typeof categoryKeys)[number];
type ItemCategory = Exclude<CategoryKey, 'all'>;

const faqItems: { id: string; category: ItemCategory }[] = [
  { id: 'ordersOne', category: 'orders' },
  { id: 'ordersTwo', category: 'orders' },
  { id: 'ordersThree', category: 'orders' },
  { id: 'subscriptionsOne', category: 'subscriptions' },
  { id: 'subscriptionsTwo', category: 'subscriptions' },
  { id: 'subscriptionsThree', category: 'subscriptions' },
  { id: 'productsOne', category: 'products' },
  { id: 'productsTwo', category: 'products' },
  { id: 'productsThree', category: 'products' },
  { id: 'shippingOne', category: 'shipping' },
  { id: 'shippingTwo', category: 'shipping' },
  { id: 'shippingThree', category: 'shipping' },
  { id: 'returnsOne', category: 'returns' },
  { id: 'returnsTwo', category: 'returns' },
  { id: 'returnsThree', category: 'returns' }
];

type FaqItem = {
  id: string;
  category: ItemCategory;
  question: string;
  answer: string;
};

type AccordionItemProps = {
  item: FaqItem;
  categoryLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
};

function AccordionItem({
  item,
  categoryLabel,
  isOpen,
  onToggle,
  index
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [item.answer]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  const contentId = `faq-panel-${item.id}`;
  const labelId = `faq-label-${item.id}`;

  return (
    <Reveal delay={index * 80}>
      <div className="rounded-2xl border border-cream/10 bg-[#140b08] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#140b08]"
          aria-expanded={isOpen}
          aria-controls={contentId}
          id={labelId}
          onClick={onToggle}
        >
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
              {categoryLabel}
            </span>
            <h3 className="text-lg font-serif text-cream">{item.question}</h3>
          </div>
          <span
            className={`mt-2 flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 text-xs uppercase tracking-[0.2em] text-cream/70 transition ${
              isOpen ? 'rotate-45 border-gold/60 text-gold' : ''
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
        <div
          className="overflow-hidden transition-[max-height] duration-300 ease-out"
          style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
        >
          <div
            ref={contentRef}
            id={contentId}
            role="region"
            aria-labelledby={labelId}
            className={`px-6 pb-6 text-sm text-cream/70 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {item.answer}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function FaqExplorer() {
  const t = useTranslations('Faq');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());

  const items = useMemo<FaqItem[]>(
    () =>
      faqItems.map((item) => ({
        id: item.id,
        category: item.category,
        question: t(`items.${item.id}.question`),
        answer: t(`items.${item.id}.answer`)
      })),
    [t]
  );

  const normalizedQuery = search.trim().toLowerCase();
  const hasFilters = normalizedQuery.length > 0 || activeCategory !== 'all';

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleToggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setSearch('');
    setActiveCategory('all');
    setOpenItems(new Set());
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
      <div className="space-y-6">
        <Reveal>
          <div className="rounded-3xl border border-cream/10 bg-noir/80 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
              {t('search.label')}
            </p>
            <label htmlFor="faq-search" className="sr-only">
              {t('search.label')}
            </label>
            <div className="mt-4">
              <input
                id="faq-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full rounded-full border border-cream/20 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-cream/40 focus:border-gold/70 focus:outline-none"
              />
            </div>
            <p className="mt-3 text-xs text-cream/50">{t('search.hint')}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
              {t('categories.label')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryKeys.map((key) => {
                const isActive = activeCategory === key;

                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(key)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                      isActive
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-cream/20 text-cream/70 hover:border-gold/50 hover:text-gold'
                    }`}
                  >
                    {t(`categories.${key}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="rounded-3xl border border-cream/10 bg-noir/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
              {t('support.eyebrow')}
            </p>
            <h3 className="mt-3 text-2xl font-serif">{t('support.title')}</h3>
            <p className="mt-2 text-sm text-cream/70">{t('support.description')}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className="rounded-full border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('support.cta')}
              </Link>
              <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
                {t('support.note')}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
              {t('results.subtitle')}
            </p>
            <p className="text-2xl font-serif">
              {t('results.count', { count: filteredItems.length })}
            </p>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-cream/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cream/70 transition hover:border-gold/60 hover:text-gold"
            >
              {t('empty.cta')}
            </button>
          ) : null}
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
              {t('empty.title')}
            </p>
            <p className="mt-3 text-sm text-cream/70">{t('empty.description')}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-full border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
            >
              {t('empty.cta')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                categoryLabel={t(`categories.${item.category}`)}
                isOpen={openItems.has(item.id)}
                onToggle={() => handleToggle(item.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
