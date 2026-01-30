'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/Toast';
import { isCoffee } from '@/types/product';
import type { GroupedChild } from '@/types/product';
import type { GrindOption, WeightOption } from '@/types/cart';

const GRIND_OPTIONS: GrindOption[] = ['beans', 'fine', 'coarse'];
const WEIGHT_OPTIONS: WeightOption[] = ['250', '500', '1000'];

/* Star rating SVG (5 stars) */
function StarRating({ rating, count }: { rating: number; count: number }) {
  const t = useTranslations('Product');
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = star <= Math.floor(rating) ? 1 : star - rating < 1 ? rating - Math.floor(rating) : 0;
          return (
            <svg key={star} viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <defs>
                <linearGradient id={`star-fill-${star}`}>
                  <stop offset={`${fill * 100}%`} stopColor="var(--color-primary)" />
                  <stop offset={`${fill * 100}%`} stopColor="var(--color-primary)" stopOpacity={0.19} />
                </linearGradient>
              </defs>
              <path
                d="M10 1l2.39 5.64L18 7.24l-4.13 3.73L14.76 17 10 14.27 5.24 17l.89-6.03L2 7.24l5.61-.6L10 1z"
                fill={`url(#star-fill-${star})`}
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs text-cream/50">{t('purchase.reviewsPlaceholder', { count })}</span>
    </div>
  );
}

type ProductPurchasePanelProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    type: string;
    collection: string;
    image?: string;
    groupedChildren: GroupedChild[];
  };
};

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const t = useTranslations('Product');
  const locale = useLocale();
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const [grind, setGrind] = useState<GrindOption>('beans');
  const [weight, setWeight] = useState<WeightOption>('250');
  const [quantity, setQuantity] = useState(1);
  const [childQuantities, setChildQuantities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (const child of product.groupedChildren) {
      initial[child.id] = 0;
    }
    return initial;
  });

  const isCoffeeProduct = isCoffee(product.collection);
  const hasGroupedChildren = product.type === 'grouped' && product.groupedChildren.length > 0;
  const isStandardCoffeeGrouped = isCoffeeProduct && hasGroupedChildren;
  const isGrouped = hasGroupedChildren && !isStandardCoffeeGrouped;
  const showCoffeeOptions = isCoffeeProduct;

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
      }),
    [locale]
  );

  const handleIncrease = () => setQuantity((c) => Math.min(99, c + 1));
  const handleDecrease = () => setQuantity((c) => Math.max(1, c - 1));

  const handleChildQty = (childId: number, delta: number) => {
    setChildQuantities((prev) => ({
      ...prev,
      [childId]: Math.max(0, Math.min(99, (prev[childId] ?? 0) + delta))
    }));
  };

  const groupedTotal = useMemo(() => {
    if (!isGrouped) return 0;
    return product.groupedChildren.reduce(
      (sum, child) => sum + child.price * (childQuantities[child.id] ?? 0),
      0
    );
  }, [isGrouped, product.groupedChildren, childQuantities]);

  const hasGroupedSelection = Object.values(childQuantities).some((q) => q > 0);

  const matchedChild = useMemo(() => {
    if (!isStandardCoffeeGrouped) return null;
    const weightMap: Record<string, string> = { '250': '250', '500': '500', '1000': '1 kg' };
    const grindMap: Record<string, string[]> = {
      beans: ['bonen'],
      fine: ['gemalen'],
      coarse: ['gemalen']
    };
    const targetWeight = weightMap[weight] ?? weight;
    const targetGrinds = grindMap[grind] ?? [];

    return (
      product.groupedChildren.find((child) => {
        const lc = child.name.toLowerCase();
        const hasWeight =
          lc.includes(`${targetWeight} g`) ||
          lc.includes(`${targetWeight}g`) ||
          lc.includes(targetWeight);
        const hasGrind = targetGrinds.some((g) => lc.includes(g));
        return hasWeight && hasGrind;
      }) ?? null
    );
  }, [isStandardCoffeeGrouped, product.groupedChildren, weight, grind]);

  const effectivePrice = matchedChild?.price ?? product.price;
  const subscriptionPrice = effectivePrice * 0.85; // 15% off

  const handleAddToCart = () => {
    if (isGrouped) {
      for (const child of product.groupedChildren) {
        const qty = childQuantities[child.id] ?? 0;
        if (qty > 0) {
          addItem({
            id: String(child.id),
            slug: child.slug,
            name: child.name,
            price: child.price,
            collection: product.collection,
            grind: null,
            weight: null,
            quantity: qty,
            image: product.image,
          });
        }
      }
    } else if (isStandardCoffeeGrouped && matchedChild) {
      addItem({
        id: String(matchedChild.id),
        slug: matchedChild.slug,
        name: matchedChild.name,
        price: matchedChild.price,
        collection: product.collection,
        grind,
        weight,
        quantity,
        image: product.image,
      });
    } else {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        collection: product.collection,
        grind: isCoffeeProduct ? grind : null,
        weight: isCoffeeProduct ? weight : null,
        quantity,
        image: product.image,
      });
    }
    showToast(t('purchase.addedToCart'), 'success');
    openCart();
  };

  const isAtMinQuantity = quantity <= 1;
  const isAtMaxQuantity = quantity >= 99;

  /* Trust badges component */
  const TrustBadges = () => (
    <div className="flex flex-wrap gap-3">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-800/40 bg-green-900/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-green-400">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.7 6.5 7 7.79l3.29-3.3 1.12 1.1z"/></svg>
        {t('purchase.trustBio')}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.7 6.5 7 7.79l3.29-3.3 1.12 1.1z"/></svg>
        {t('purchase.trustFairTrade')}
      </span>
    </div>
  );

  /* Shipping info */
  const ShippingInfo = () => (
    <div className="flex items-center gap-2 text-xs text-cream/50">
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-cream/40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 13h3l2-8h8l2 4h3v4h-2m-14 0h-2m4 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/>
      </svg>
      {t('purchase.shippingInfo')}
    </div>
  );

  // --- Grouped product layout ---
  if (isGrouped) {
    return (
      <div className="space-y-6">
        <StarRating rating={4.5} count={24} />

        <div className="rounded-3xl border border-cream/10 bg-surface-darkest/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-serif text-3xl text-cream">
                {priceFormatter.format(Math.min(...product.groupedChildren.map((c) => c.price)))}
                {' – '}
                {priceFormatter.format(Math.max(...product.groupedChildren.map((c) => c.price)))}
              </p>
            </div>
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold">
              {t('purchase.availability')}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {product.groupedChildren.map((child) => {
              const qty = childQuantities[child.id] ?? 0;
              return (
                <div
                  key={child.id}
                  className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-noir/50 p-3"
                >
                  <div className="flex items-center rounded-full border border-cream/10 bg-noir/70">
                    <button
                      type="button"
                      onClick={() => handleChildQty(child.id, -1)}
                      disabled={qty <= 0}
                      className={`px-3 py-2 text-sm transition ${
                        qty <= 0
                          ? 'cursor-not-allowed text-cream/30'
                          : 'text-cream/70 hover:text-cream'
                      }`}
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm text-cream">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleChildQty(child.id, 1)}
                      disabled={qty >= 99}
                      className={`px-3 py-2 text-sm transition ${
                        qty >= 99
                          ? 'cursor-not-allowed text-cream/30'
                          : 'text-cream/70 hover:text-cream'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-cream">{child.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-gold">
                    {priceFormatter.format(child.price)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!hasGroupedSelection}
              className={`w-full rounded-full px-6 py-3.5 text-xs uppercase tracking-[0.3em] transition ${
                hasGroupedSelection
                  ? 'bg-gold text-noir hover:bg-gold/90 active:scale-95'
                  : 'cursor-not-allowed bg-cream/10 text-cream/30'
              }`}
            >
              {t('addToCart')}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-cream/70">
            <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
              {t('purchase.totalLabel')}
            </span>
            <span className="font-semibold text-gold">{priceFormatter.format(groupedTotal)}</span>
          </div>
        </div>

        <ShippingInfo />
        <TrustBadges />
        <p className="text-xs text-cream/60">{t('purchase.hint')}</p>
      </div>
    );
  }

  // --- Simple / non-grouped product layout ---
  return (
    <div className="space-y-6">
      {/* Reviews placeholder */}
      <StarRating rating={4.5} count={24} />

      {/* Price prominent */}
      <div className="space-y-1">
        <p className="font-serif text-3xl text-cream">{priceFormatter.format(effectivePrice)}</p>
        {isCoffeeProduct && (
          <p className="text-sm text-cream/50">
            {t('purchase.subscriptionPrice', {
              price: priceFormatter.format(subscriptionPrice)
            })}
          </p>
        )}
      </div>

      {/* Purchase panel */}
      <div className="rounded-3xl border border-cream/10 bg-surface-darkest/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('purchase.eyebrow')}</p>
          <span className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold">
            {t('purchase.availability')}
          </span>
        </div>

        {showCoffeeOptions && (
          <div className="mt-6 space-y-5">
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-[0.3em] text-cream/60">
                {t('variants.grindLabel')}
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {GRIND_OPTIONS.map((option) => {
                  const isActive = grind === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGrind(option)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-2.5 text-xs uppercase tracking-[0.2em] transition ${
                        isActive
                          ? 'border-gold bg-gold text-noir'
                          : 'border-cream/10 bg-noir/70 text-cream/70 hover:border-gold/60 hover:text-cream'
                      }`}
                    >
                      {t(`variants.grind.${option}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-[0.3em] text-cream/60">
                {t('variants.weightLabel')}
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {WEIGHT_OPTIONS.map((option) => {
                  const isActive = weight === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setWeight(option)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-2.5 text-xs uppercase tracking-[0.2em] transition ${
                        isActive
                          ? 'border-gold bg-gold text-noir'
                          : 'border-cream/10 bg-noir/70 text-cream/70 hover:border-gold/60 hover:text-cream'
                      }`}
                    >
                      {t(`variants.weight.${option}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}

        {/* Quantity + Total */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/60">{t('quantityLabel')}</p>
              <div className="flex items-center rounded-full border border-cream/10 bg-noir/70">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isAtMinQuantity}
                  aria-label={t('quantityDecrease')}
                  className={`px-4 py-2 text-lg transition ${
                    isAtMinQuantity
                      ? 'cursor-not-allowed text-cream/30'
                      : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm text-cream">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isAtMaxQuantity}
                  aria-label={t('quantityIncrease')}
                  className={`px-4 py-2 text-lg transition ${
                    isAtMaxQuantity
                      ? 'cursor-not-allowed text-cream/30'
                      : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-[0.3em] text-cream/50">{t('purchase.totalLabel')}</span>
              <p className="font-semibold text-gold">{priceFormatter.format(effectivePrice * quantity)}</p>
            </div>
          </div>

          {/* Two buttons: Add to Cart (primary) + Subscribe (secondary) */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-full bg-gold px-6 py-3.5 text-xs uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 active:scale-95"
            >
              {t('addToCart')}
            </button>
            {isCoffeeProduct && (
              <Link
                href="/subscriptions"
                className="rounded-full border border-gold/60 px-6 py-3.5 text-center text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold/10 active:scale-95"
              >
                {t('purchase.subscribe')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Shipping info */}
      <ShippingInfo />

      {/* Trust badges */}
      <TrustBadges />

      <p className="text-xs text-cream/60">{t('purchase.hint')}</p>
    </div>
  );
}
