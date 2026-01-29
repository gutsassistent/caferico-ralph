'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/components/CartProvider';
import { isCoffee } from '@/types/product';
import type { GroupedChild } from '@/types/product';
import type { GrindOption, WeightOption } from '@/types/cart';

const GRIND_OPTIONS: GrindOption[] = ['beans', 'fine', 'coarse'];
const WEIGHT_OPTIONS: WeightOption[] = ['250', '500', '1000'];

type ProductPurchasePanelProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    type: string;
    collection: string;
    groupedChildren: GroupedChild[];
  };
};

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const t = useTranslations('Product');
  const locale = useLocale();
  const { addItem, openCart } = useCart();
  const [grind, setGrind] = useState<GrindOption>('beans');
  const [weight, setWeight] = useState<WeightOption>('250');
  const [quantity, setQuantity] = useState(1);
  // For grouped products: track quantities per child
  const [childQuantities, setChildQuantities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (const child of product.groupedChildren) {
      initial[child.id] = 0;
    }
    return initial;
  });

  const isCoffeeProduct = isCoffee(product.collection);
  const hasGroupedChildren = product.type === 'grouped' && product.groupedChildren.length > 0;

  // Coffee grouped products with standard weight/grind variants use the
  // original maling + gewicht buttons. Only non-standard grouped products
  // (koffiepads, cadeaupakketten, etc.) show the child product list.
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

  const handleIncrease = () => {
    setQuantity((current) => Math.min(99, current + 1));
  };

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

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

  // For standard coffee grouped products: find the matching child based on
  // selected weight and grind, so we use the correct price and product ID.
  const matchedChild = useMemo(() => {
    if (!isStandardCoffeeGrouped) return null;
    const weightMap: Record<string, string> = { '250': '250', '500': '500', '1000': '1 kg' };
    const grindMap: Record<string, string[]> = {
      beans: ['bonen'],
      fine: ['gemalen'],
      coarse: ['gemalen'] // coarse also maps to gemalen in WooCommerce
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

  const handleAddToCart = () => {
    if (isGrouped) {
      // Non-standard grouped: add each selected child
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
            quantity: qty
          });
        }
      }
    } else if (isStandardCoffeeGrouped && matchedChild) {
      // Standard coffee grouped: add the matched child variant
      addItem({
        id: String(matchedChild.id),
        slug: matchedChild.slug,
        name: matchedChild.name,
        price: matchedChild.price,
        collection: product.collection,
        grind,
        weight,
        quantity
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
        quantity
      });
    }
    openCart();
  };

  const isAtMinQuantity = quantity <= 1;
  const isAtMaxQuantity = quantity >= 99;

  // --- Grouped product layout ---
  if (isGrouped) {
    return (
      <div className="rounded-3xl border border-cream/10 bg-[#120907]/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
              {t('purchase.eyebrow')}
            </p>
            <p className="font-serif text-2xl text-cream">
              {priceFormatter.format(Math.min(...product.groupedChildren.map((c) => c.price)))}
              {' – '}
              {priceFormatter.format(Math.max(...product.groupedChildren.map((c) => c.price)))}
            </p>
          </div>
          <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
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
                    className={`px-3 py-1 text-sm transition ${
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
                    className={`px-3 py-1 text-sm transition ${
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

        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasGroupedSelection}
            className={`w-full rounded-full border px-6 py-3 text-xs uppercase tracking-[0.3em] transition ${
              hasGroupedSelection
                ? 'border-gold/60 text-gold hover:bg-gold hover:text-noir'
                : 'cursor-not-allowed border-cream/10 text-cream/30'
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
        <p className="mt-4 text-xs text-cream/50">{t('purchase.hint')}</p>
      </div>
    );
  }

  // --- Simple / non-grouped product layout ---
  return (
    <div className="rounded-3xl border border-cream/10 bg-[#120907]/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('purchase.eyebrow')}</p>
          <p className="font-serif text-2xl text-cream">{priceFormatter.format(effectivePrice)}</p>
        </div>
        <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
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
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${
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
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${
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

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
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

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 rounded-full border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir sm:flex-none"
        >
          {t('addToCart')}
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-cream/70">
        <span className="text-xs uppercase tracking-[0.3em] text-cream/50">
          {t('purchase.totalLabel')}
        </span>
        <span className="font-semibold text-gold">
          {priceFormatter.format(effectivePrice * quantity)}
        </span>
      </div>
      <p className="mt-4 text-xs text-cream/50">{t('purchase.hint')}</p>
    </div>
  );
}
