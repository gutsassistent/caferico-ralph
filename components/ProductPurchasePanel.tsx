'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/components/CartProvider';
import { isAccessory } from '@/types/product';
import type { GrindOption, WeightOption } from '@/types/cart';

const GRIND_OPTIONS: GrindOption[] = ['beans', 'fine', 'coarse'];
const WEIGHT_OPTIONS: WeightOption[] = ['250', '500', '1000'];

type ProductPurchasePanelProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    collection: string;
  };
};

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const t = useTranslations('Product');
  const locale = useLocale();
  const { addItem, openCart } = useCart();
  const [grind, setGrind] = useState<GrindOption>('beans');
  const [weight, setWeight] = useState<WeightOption>('250');
  const [quantity, setQuantity] = useState(1);

  const isAccessoryProduct = isAccessory(product.collection);

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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      collection: product.collection,
      grind: isAccessoryProduct ? null : grind,
      weight: isAccessoryProduct ? null : weight,
      quantity
    });
    openCart();
  };

  const isAtMinQuantity = quantity <= 1;
  const isAtMaxQuantity = quantity >= 99;

  return (
    <div className="rounded-3xl border border-cream/10 bg-[#120907]/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('purchase.eyebrow')}</p>
          <p className="font-serif text-2xl text-cream">{priceFormatter.format(product.price)}</p>
        </div>
        <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
          {t('purchase.availability')}
        </span>
      </div>

      {!isAccessoryProduct && (
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

      <div
        className={`flex flex-wrap items-end justify-between gap-4 ${isAccessoryProduct ? 'mt-6' : 'mt-6'}`}
      >
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
          {priceFormatter.format(product.price * quantity)}
        </span>
      </div>
      <p className="mt-4 text-xs text-cream/50">{t('purchase.hint')}</p>
    </div>
  );
}
